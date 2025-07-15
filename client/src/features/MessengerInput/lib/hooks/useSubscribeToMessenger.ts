import { useEffect, useState } from 'react';
import mapChatDTO from '@widgets/Messenger/api/mappers/mapChatDTO';
import postContactsMembersApi from '@features/EditMembers/api/postContactsMembersApi';
import { MessageSchema } from 'features/Message';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { addMessenger } from '@entities/Messenger/model/slice/messengerSlice';
import isMember from '@entities/User/lib/IsMember/isMember';
import { useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';

const useSubscribeToMessenger = (
    messenger: AdaptMessengerSchema,
    messagesList: MessageSchema[],
) => {
    const [buttonState, setButtonState] = useState(false);
    const { getSignal } = useAbortController();

    const userId = useAppSelector(state => state.user.userId);
    const dispatch = useAppDispatch();

    const adaptMessenger = () => {
        const lastMessage = messagesList[messagesList.length - 1];
        dispatch(addMessenger(mapChatDTO(messenger, lastMessage)));

        setButtonState(true);
    };

    const subscribeToMessenger = async () => {
        const signal = getSignal();

        try {
            if (messenger.type === 'chat') return adaptMessenger();

            const newMembers = await postContactsMembersApi([userId], messenger.id, signal);
            if (newMembers.status === 200) adaptMessenger();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (
            (messenger.type === 'chat' && messagesList.length > 0) ||
            isMember(messenger.members!, userId)
        ) {
            setButtonState(true);
        } else setButtonState(false);
    }, [messenger]);

    return { buttonState, subscribeToMessenger };
};

export default useSubscribeToMessenger;
