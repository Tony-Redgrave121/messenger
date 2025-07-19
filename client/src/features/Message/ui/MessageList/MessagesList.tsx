import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { MessageContext } from '@features/Message/lib/hooks/useMessageContext';
import Message from '@features/Message/ui/Message/Message';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { ReactionSchema, MessageSchema } from '@shared/types';

interface IMessagesListProps {
    messagesList: MessageSchema[];
    messenger: AdaptMessengerSchema;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    reactions: ReactionSchema[];
}

const MessagesList: FC<IMessagesListProps> = ({
    messagesList,
    messenger,
    setReply,
    socketRef,
    reactions,
}) => {
    return (
        <MessageContext.Provider
            value={{
                messenger,
                setReply,
                socketRef,
                reactions,
            }}
        >
            {messagesList.map(message => (
                <Message message={message} key={message.message_id} />
            ))}
        </MessageContext.Provider>
    );
};

export default MessagesList;
