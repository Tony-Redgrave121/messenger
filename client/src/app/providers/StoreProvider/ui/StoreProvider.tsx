import React, { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../config/store';

interface StoreProviderProps {
    children?: ReactNode;
}

const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
    const store = setupStore();

    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
