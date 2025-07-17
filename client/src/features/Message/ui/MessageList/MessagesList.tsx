import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { Message } from '@features/Message';
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
        <>
            {messagesList.map(message => (
                <Message
                    message={message}
                    messenger={messenger}
                    key={message.message_id}
                    setReply={setReply}
                    socketRef={socketRef}
                    reactions={reactions}
                />
            ))}
        </>
    );
};

export default MessagesList;
