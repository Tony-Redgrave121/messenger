import React, { FC, ReactNode, useRef, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import useFetchPost from '@widgets/Messenger/lib/hooks/useFetchPost';
import useInfiniteMessages from '@widgets/Messenger/lib/hooks/useInfiniteMessages';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessageContext, MessagesList } from '@features/Message';
import { InputBlock } from '@features/MessengerInput';
import { MessengerContext } from '@entities/Messenger';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

interface IPostProps {
    children?: ReactNode;
}

const Post: FC<IPostProps> = ({ children }) => {
    const [reply, setReply] = useState<MessageSchema | null>(null);

    const refVirtuoso = useRef<VirtuosoHandle | null>(null);
    const refContainer = useRef<HTMLElement | null>(null);

    const { messenger, reactions } = useFetchInitialData();
    const { messagesList, socketRef, handleFetching, totalCount } =
        useInfiniteMessages(refContainer);

    const { channelPost } = useFetchPost();

    return (
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
            {channelPost && (
                <section className={style.MessageBlock} ref={refContainer}>
                    <MessageContext.Provider
                        value={{
                            messenger: { ...messenger, type: 'group' },
                            setReply,
                            socketRef,
                            reactions,
                            refContainer,
                        }}
                    >
                        <MessagesList
                            messagesList={[channelPost, ...messagesList]}
                            onStartReached={handleFetching}
                            totalCount={totalCount + 1}
                            refVirtuoso={refVirtuoso}
                        />
                    </MessageContext.Provider>
                </section>
            )}
            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef} />
        </div>
    );
};

export default Post;
