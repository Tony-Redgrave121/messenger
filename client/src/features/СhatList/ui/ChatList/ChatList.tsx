import { lazy, memo, useEffect } from 'react';
import { setMessengers } from '@entities/Messenger/model/slice/messengerSlice';
import { useAppDispatch, useAppSelector, useAbortController } from '@shared/lib';
import chatListApi from '../../api/chatListApi';
import style from './style.module.css';

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
    }, [dispatch, userId]);

    return (
        <ul className={style.ChatList}>
            {messengers.map(messenger => (
                <ChatBlock key={messenger.messenger_id} messenger={messenger} />
            ))}
        </ul>
    );
});

ChatList.displayName = 'ChatList';

export default ChatList;
