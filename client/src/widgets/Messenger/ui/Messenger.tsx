import React, { lazy, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessengerHeader } from '@widgets/Header';
import useAutoScroll from '@widgets/Messenger/lib/hooks/useAutoScroll';
import { MessagesList } from '@features/MessageList';
import { MessengerInput } from '@features/MessengerInput';
import { MessageSchema } from '@entities/Message';
import useFetchInitialData from '@entities/Messenger/lib/hooks/useFetchInitialData';
import { clearNotification } from '@entities/Messenger/lib/thunk/messengerThunk';
import { useAppDispatch } from '@shared/lib';
import style from './style.module.css';

const RightSidebar = lazy(() => import('@widgets/RightSidebar/ui/RightSidebar'));

const Messenger = memo(() => {
    const [reply, setReply] = useState<MessageSchema | null>(null);
    const refEnd = useRef<HTMLDivElement>(null);

    const { messenger, setMessenger, reactions, messagesList, socketRef } = useFetchInitialData();
    const { messengerId } = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (messengerId) dispatch(clearNotification(messengerId));
    }, [dispatch, messengerId]);

    useAutoScroll(refEnd, messagesList);

    return (
        <>
            <div className={style.MessengerContainer}>
                <MessengerHeader messenger={messenger} />
                <section className={style.MessageBlock} key={messengerId}>
                    <MessagesList
                        messagesList={messagesList}
                        messenger={messenger}
                        setReply={setReply}
                        socketRef={socketRef}
                        reactions={reactions}
                    />
                    <div ref={refEnd} />
                </section>
                <MessengerInput
                    reply={reply}
                    setReply={setReply}
                    messenger={messenger}
                    messagesList={messagesList}
                    socketRef={socketRef}
                />
            </div>
            <RightSidebar entity={messenger} setEntity={setMessenger} key={messenger.id} />
        </>
    );
});

Messenger.displayName = 'Messenger';

export default Messenger;
