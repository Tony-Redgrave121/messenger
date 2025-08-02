import { memo, useEffect } from 'react';
import chatListApi from '@features/СhatList/api/chatListApi';
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
        <ul className={style.ChatList}>
            {messengers.map(messenger => (
                <ChatBlock
                    onClick={closeSidebar}
                    key={messenger.messenger_id}
                    messenger={messenger}
                />
            ))}
        </ul>
    );
});

ChatList.displayName = 'ChatList';

export default ChatList;
