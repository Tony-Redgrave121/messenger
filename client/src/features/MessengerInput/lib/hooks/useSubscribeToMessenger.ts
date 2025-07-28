import { useEffect, useState } from 'react';
import mapChatDTO from '@features/MessengerInput/api/mappers/mapChatDTO';
import { isMember, postContactsMembersApi } from '@entities/Member';
import { AdaptMessengerSchema, addMessenger } from '@entities/Messenger';
import { useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';

const useSubscribeToMessenger = (
    messenger: AdaptMessengerSchema,
    messagesList: MessageSchema[],
) => {
    const [buttonState, setButtonState] = useState<boolean | null>(null);
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
    }, [messenger, messagesList, userId]);

    return { buttonState, subscribeToMessenger };
};

export default useSubscribeToMessenger;
