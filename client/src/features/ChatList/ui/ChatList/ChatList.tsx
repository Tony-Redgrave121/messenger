import { memo, useEffect } from 'react';
import chatListApi from '@features/ChatList/api/chatListApi';
import { ChatBlock, setMessengers, useCloseLeftSidebar } from '@entities/Messenger';
import { useAppDispatch, useAppSelector, useAbortController } from '@shared/lib';
import style from './style.module.css';

const ChatList = memo(() => {
    const userId = useAppSelector(state => state.user.userId);
    const messengers = useAppSelector(state => state.messenger.messengers);
    const dispatch = useAppDispatch();

    const { getSignal } = useAbortController();
    const { closeSidebar } = useCloseLeftSidebar();

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
        <ul className={style.ChatList} aria-live="polite">
            {messengers.map(messenger => (
                <li key={messenger.messenger_id}>
                    <ChatBlock onClick={closeSidebar} messenger={messenger} />
                </li>
            ))}
        </ul>
    );
});

ChatList.displayName = 'ChatList';

export default ChatList;
