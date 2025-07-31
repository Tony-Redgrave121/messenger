import { createContext, RefObject, useContext } from 'react';

export interface ILiveUpdatesContext {
    socketRef: RefObject<WebSocket | null>;
}

export const LiveUpdatesContext = createContext<ILiveUpdatesContext | null>(null);

export const useLiveUpdatesContext = () => {
    const context = useContext(LiveUpdatesContext);
    if (!context) throw new Error('useLiveUpdatesContext must be used within a Provider');

    return context;
};
