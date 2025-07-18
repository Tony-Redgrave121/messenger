import React, { lazy, memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessengerHeader } from '@widgets/Header';
import useAutoScroll from '@widgets/Messenger/lib/hooks/useAutoScroll';
import useFetchInitialData from '@widgets/Messenger/lib/hooks/useFetchInitialData';
import { MessagesList } from '@features/Message';
import { MessengerInput } from '@features/MessengerInput';
import { clearNotification } from '@entities/Messenger';
import { useAppDispatch } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

const RightSidebar = lazy(() => import('@widgets/RightSidebar/ui/RightSidebar/RightSidebar'));

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
