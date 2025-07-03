import React, {FC, ReactNode} from 'react';
import {setupStore} from "../config/store";
import {Provider} from "react-redux";

interface StoreProviderProps {
    children?: ReactNode
}

const StoreProvider: FC<StoreProviderProps> = ({children}) => {
    const store = setupStore()

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default StoreProvider;