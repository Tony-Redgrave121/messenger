import { Dispatch, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import deleteMemberApi from '@features/EditMembers/api/deleteMemberApi';
import deleteRemovedApi from '@features/EditMembers/api/deleteRemovedApi';
import postMemberApi from '@features/EditMembers/api/postMemberApi';
import putMessengerModeratorApi from '@features/EditMembers/api/putMessengerModeratorApi';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useLiveUpdatesWS } from '@entities/Reaction/lib/hooks/useLiveUpdatesWS';
import { useAppSelector, useAbortController } from '@shared/lib';

const useEditSettings = (setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>) => {
    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const [popup, setPopup] = useState(false);
    const socketRef = useLiveUpdatesWS();

    const messengers = useAppSelector(state => state.messenger.messengers);

    const handleCancel = () => {
        setPopup(false);
        setTimeout(() => setPopup(false), 300);
    };

    const dismissModerator = async (userId: string) => {
        if (!messengerId) return;

        try {
            const newModerators = await putMessengerModeratorApi('member', userId, messengerId);

            if (newModerators.data.message) return;

            setSettings(prev => ({
                ...prev,
                moderators: [
                    ...prev.moderators.filter(
                        moderator => moderator.member_id !== newModerators.data.member_id,
                    ),
                ],
            }));

            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const addToGroup = async (userId: string) => {
        if (!messengerId) return;

        try {
            const signal = getSignal();

            const newMembers = await postMemberApi(userId, messengerId, signal);
            if (newMembers.data.message) return;

            setSettings(prev => ({
                ...prev,
                members: [...prev.members, newMembers.data],
            }));

            setSettings(prev => ({
                ...prev,
                removed_users: [
                    ...prev.removed_users.filter(({ user }) => user.user_id !== userId),
                ],
            }));

            if (socketRef?.readyState === WebSocket.OPEN) {
                socketRef.send(
                    JSON.stringify({
                        user_id: userId,
                        method: 'JOIN_TO_MESSENGER',
                        data: {
                            ...messengers.find(messenger => messenger.messenger_id === messengerId),
                            messenger_members: [userId],
                        },
                    }),
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFromRemoved = async (userId: string) => {
        if (!messengerId) return;

        try {
            const signal = getSignal();

            const deletedRemoved = await deleteRemovedApi(userId, messengerId, signal);

            if (deletedRemoved.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    removed_users: [
                        ...prev.removed_users.filter(({ user }) => user.user_id !== userId),
                    ],
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFromGroup = async (userId: string) => {
        if (!messengerId) return;
        const signal = getSignal();

        try {
            const deletedMember = await deleteMemberApi(userId, messengerId, signal);

            if (deletedMember.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    members: [...prev.members.filter(({ user }) => user.user_id !== userId)],
                }));

                setSettings(prev => ({
                    ...prev,
                    moderators: [...prev.moderators.filter(({ user }) => user.user_id !== userId)],
                }));

                if (socketRef?.readyState === WebSocket.OPEN) {
                    socketRef.send(
                        JSON.stringify({
                            user_id: userId,
                            method: 'REMOVE_FROM_MESSENGER',
                            data: messengerId,
                        }),
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        popup,
        setPopup,
        handleCancel,
        dismissModerator,
        addToGroup,
        deleteFromRemoved,
        deleteFromGroup,
    };
};

export default useEditSettings;
