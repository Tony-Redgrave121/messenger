import { clsx } from 'clsx';
import React, { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useInfiniteMessages from '@widgets/Messenger/lib/hooks/useInfiniteMessages';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessagesList } from '@features/Message';
import { MessengerInput } from '@features/MessengerInput';
import { checkRights } from '@entities/Member';
import { clearNotification } from '@entities/Messenger';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

interface IMessengerProps {
    children?: ReactNode;
}

const Messenger: FC<IMessengerProps> = memo(({ children }) => {
    const [reply, setReply] = useState<MessageSchema | null>(null);
    const refEnd = useRef<HTMLDivElement | null>(null);
    const refContainer = useRef<HTMLElement | null>(null);

    const { messenger, reactions } = useFetchInitialData();
    const { messagesList, socketRef, handleFetching, totalCount } =
        useInfiniteMessages(refContainer);
    const { messengerId } = useParams();

    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.user.userId);

    useEffect(() => {
        if (messengerId) dispatch(clearNotification(messengerId));
    }, [dispatch, messengerId]);

    // useAutoScroll(refEnd, messagesList);

    return (
        <>
            <div className={style.MessengerContainer}>
                {children}
                <section
                    className={clsx(
                        style.MessageBlock,
                        messenger.type === 'channel' &&
                            !checkRights(messenger.members!, userId) &&
                            style.ChannelMessageBlock,
                    )}
                    ref={refContainer}
                    key={messengerId}
                >
                    <MessagesList
                        messagesList={messagesList}
                        messenger={messenger}
                        setReply={setReply}
                        socketRef={socketRef}
                        reactions={reactions}
                        onStartReached={handleFetching}
                        totalCount={totalCount}
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
