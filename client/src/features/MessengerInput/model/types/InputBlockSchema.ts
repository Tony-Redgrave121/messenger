import { Dispatch, RefObject, SetStateAction } from 'react';
import { MessageSchema } from '@shared/types';

export default interface InputBlockSchema {
    reply: MessageSchema | null;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    members?: string[];
}
