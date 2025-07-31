import React, { FC, lazy, ReactNode, Suspense } from 'react';
import { LiveUpdatesContext, useLiveUpdatesWS } from '@entities/Messenger';
import style from './layout.module.css';

const PopupMessage = lazy(() => import('@entities/Message/ui/PopupMessage/PopupMessage'));
const Slider = lazy(() => import('@features/Slider/ui/Slider/Slider'));

interface IPageLayoutProps {
    children: ReactNode;
}

const PageLayout: FC<IPageLayoutProps> = ({ children }) => {
    const { socketRef } = useLiveUpdatesWS();

    return (
        <div className={style.LayoutContainer}>
            <LiveUpdatesContext.Provider
                value={{
                    socketRef: socketRef,
                }}
            >
                <div className={style.Layout}>{children}</div>
            </LiveUpdatesContext.Provider>
            <Suspense>
                <PopupMessage />
                <Slider />
            </Suspense>
        </div>
    );
};

export default PageLayout;
