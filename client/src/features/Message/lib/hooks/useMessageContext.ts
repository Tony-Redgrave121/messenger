import { createContext, Dispatch, RefObject, SetStateAction, useContext } from 'react';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { MessageSchema, ReactionSchema } from '@shared/types';

export interface IMessageContext {
    messenger: AdaptMessengerSchema;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    reactions: ReactionSchema[];
}

export const MessageContext = createContext<IMessageContext | null>(null);

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) throw new Error('useMessageContext must be used within a Provider');

    return context;
};
