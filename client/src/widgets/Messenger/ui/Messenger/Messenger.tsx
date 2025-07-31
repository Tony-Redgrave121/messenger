import { clsx } from 'clsx';
import React, { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VirtuosoHandle } from 'react-virtuoso';
import useInfiniteMessages from '@widgets/Messenger/lib/hooks/useInfiniteMessages';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessageContext, MessagesList } from '@features/Message';
import { MessengerInput } from '@features/MessengerInput';
import { checkRights } from '@entities/Member';
import { clearNotification, MessengerContext } from '@entities/Messenger';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

interface IMessengerProps {
    children?: ReactNode;
}

const Messenger: FC<IMessengerProps> = memo(({ children }) => {
    const [reply, setReply] = useState<MessageSchema | null>(null);
    const refEnd = useRef<HTMLDivElement | null>(null);

    const refVirtuoso = useRef<VirtuosoHandle | null>(null);
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

    return (
        <>
            <div className={style.MessengerContainer}>
                <MessengerContext.Provider
                    value={{
                        refVirtuoso,
                        messagesList,
                        handleFetching,
                        totalCount,
                    }}
                >
                    {children}
                </MessengerContext.Provider>
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
                    <MessageContext.Provider
                        value={{
                            messenger,
                            setReply,
                            socketRef,
                            reactions,
                        }}
                    >
                        <MessagesList
                            messagesList={messagesList}
                            onStartReached={handleFetching}
                            totalCount={totalCount}
                            refVirtuoso={refVirtuoso}
                        />
                    </MessageContext.Provider>
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
