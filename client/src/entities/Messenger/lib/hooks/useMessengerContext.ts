import { createContext, RefObject, useContext } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { MessageSchema } from '@shared/types';

export interface IMessengerContext {
    refVirtuoso: RefObject<VirtuosoHandle | null>;
    messagesList: MessageSchema[];
    handleFetching: () => Promise<void>;
    totalCount: number;
}

export const MessengerContext = createContext<IMessengerContext | null>(null);

export const useMessengerContext = () => {
    const context = useContext(MessengerContext);
    if (!context) throw new Error('useMessengerContext must be used within a Provider');

    return context;
};
