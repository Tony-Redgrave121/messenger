import React, { FC, ReactNode, useRef, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import useFetchPost from '@widgets/Messenger/lib/hooks/useFetchPost';
import useInfiniteMessages from '@widgets/Messenger/lib/hooks/useInfiniteMessages';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessageContext, MessagesList } from '@features/Message';
import { InputBlock } from '@features/MessengerInput';
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
    const { messagesList, socketRef, handleFetching, totalCount, setMessagesList } =
        useInfiniteMessages(refContainer);

    const { channelPost } = useFetchPost(setMessagesList);

    return (
        <div className={style.MessengerContainer}>
            {children}
            {channelPost && (
                <section className={style.MessageBlock} ref={refContainer}>
                    <MessageContext.Provider
                        value={{
                            messenger: { ...messenger, type: 'group' },
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
                </section>
            )}
            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef} />
        </div>
    );
};

export default Post;
