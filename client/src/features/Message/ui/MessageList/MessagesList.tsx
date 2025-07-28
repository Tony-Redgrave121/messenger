import React, { Dispatch, FC, RefObject, SetStateAction, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { MessageContext } from '@features/Message/lib/hooks/useMessageContext';
import Message from '@features/Message/ui/Message/Message';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { ReactionSchema, MessageSchema } from '@shared/types';
import style from './message-list.module.css';

interface IMessagesListProps {
    messagesList: MessageSchema[];
    messenger: AdaptMessengerSchema;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    reactions: ReactionSchema[];
    onStartReached: () => void;
    totalCount: number;
}

const MessagesList: FC<IMessagesListProps> = ({
    messagesList,
    messenger,
    setReply,
    socketRef,
    reactions,
    onStartReached,
    totalCount,
}) => {
    const [viewedIds, setViewedIds] = useState<string[]>([]);

    return (
        <MessageContext.Provider
            value={{
                messenger,
                setReply,
                socketRef,
                reactions,
            }}
        >
            <Virtuoso
                className={style.VirtuosoContainer}
                data={messagesList}
                itemContent={(_, message) => (
                    <Message
                        message={message}
                        viewedIds={viewedIds}
                        setViewedIds={setViewedIds}
                        key={message.message_id}
                    />
                )}
                initialTopMostItemIndex={messagesList?.length}
                followOutput="auto"
                atTopStateChange={atTop => {
                    if (atTop) onStartReached();
                }}
                firstItemIndex={totalCount - messagesList?.length}
            />
            {/*{messagesList.map(message => (*/}
            {/*    <Message message={message} key={message.message_id} />*/}
            {/*))}*/}
        </MessageContext.Provider>
    );
};

export default MessagesList;
