import React, { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAutoScroll from '@widgets/Messenger/lib/hooks/useAutoScroll';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessagesList } from '@features/Message';
import { MessengerInput } from '@features/MessengerInput';
import { clearNotification } from '@entities/Messenger';
import { useAppDispatch } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

interface IMessengerProps {
    children?: ReactNode;
}

const Messenger: FC<IMessengerProps> = memo(({ children }) => {
    const [reply, setReply] = useState<MessageSchema | null>(null);
    const refEnd = useRef<HTMLDivElement>(null);

    const { messenger, reactions, messagesList, socketRef } = useFetchInitialData();
    const { messengerId } = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (messengerId) dispatch(clearNotification(messengerId));
    }, [dispatch, messengerId]);

    useAutoScroll(refEnd, messagesList);

    return (
        <>
            <div className={style.MessengerContainer}>
                {children}
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
        </>
    );
});

Messenger.displayName = 'Messenger';

export default Messenger;
