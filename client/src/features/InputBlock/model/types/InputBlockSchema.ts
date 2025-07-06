import { Dispatch, RefObject, SetStateAction } from 'react';
import { MessageSchema } from '@entities/Message';

export default interface InputBlockSchema {
    reply: MessageSchema | null;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    members?: string[];
}
