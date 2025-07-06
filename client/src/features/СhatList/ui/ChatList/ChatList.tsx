import { lazy, memo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import style from './style.module.css';
import { setMessengers } from '@entities/Messenger/model/slice/messengerSlice';
import { useAbortController } from '@shared/lib';
import chatListApi from '../../api/chatListApi';

const ChatBlock = lazy(() => import('@entities/Messenger/ui/СhatBlock/ChatBlock'));

const ChatList = memo(() => {
    const userId = useAppSelector(state => state.user.userId);
    const messengers = useAppSelector(state => state.messenger.messengers);
    const dispatch = useAppDispatch();

    const { getSignal } = useAbortController();

    useEffect(() => {
        const signal = getSignal();

        const handleMessengerList = async () => {
            try {
                const response = await chatListApi(userId, signal);
                dispatch(setMessengers(response.data));
            } catch (e) {
                console.error(e);
            }
        };

        handleMessengerList();
    }, [userId]);

    return (
        <ul className={style.ChatList}>
            {messengers.map(messenger => (
                <ChatBlock key={messenger.messenger_id} messenger={messenger} />
            ))}
        </ul>
    );
});

export default ChatList;
