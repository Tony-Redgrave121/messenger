import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { HiOutlineArrowRight, HiOutlineXMark } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import postContactsMembersApi from '@features/EditMembers/api/postContactsMembersApi';
import { AddContact } from '@entities/Contact';
import { useLiveUpdatesWS } from '@entities/Messenger';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useAbortController, useAppSelector } from '@shared/lib';
import { ContactSchema } from '@shared/types';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import style from './style.module.css';

interface IPopupEditSubscribersProps {
    handleCancel: () => void;
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const PopupEditSubscribers: FC<IPopupEditSubscribersProps> = ({ handleCancel, setSettings }) => {
    const [members, setMembers] = useState<ContactSchema[]>([]);
    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const socketRef = useLiveUpdatesWS();
    const messengers = useAppSelector(state => state.messenger.messengers);
    const userId = useAppSelector(state => state.user.userId);

    const handleAddMembers = async () => {
        if (!messengerId) return;
        const signal = getSignal();

        try {
            const membersId = members.map(member => member.user_id);
            const newMembers = await postContactsMembersApi(membersId, messengerId, signal);

            if (newMembers.data.message) return;

            setSettings(prev => ({
                ...prev,
                members: [...prev.members, ...newMembers.data],
            }));

            if (socketRef?.readyState === WebSocket.OPEN) {
                socketRef.send(
                    JSON.stringify({
                        user_id: userId,
                        method: 'JOIN_TO_MESSENGER',
                        data: {
                            ...messengers.find(messenger => messenger.messenger_id === messengerId),
                            messenger_members: membersId,
                        },
                    }),
                );
            }

            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <DefaultButton foo={handleCancel}>
                        <HiOutlineXMark />
                    </DefaultButton>
                    <p>Add Subscribers</p>
                </span>
            </div>
            <div className={style.SearchBar}>
                <AddContact members={members} setMembers={setMembers} />
            </div>
            <CreateButton state={members.length > 0} foo={handleAddMembers}>
                <HiOutlineArrowRight />
            </CreateButton>
        </>
    );
};

export default PopupEditSubscribers;
