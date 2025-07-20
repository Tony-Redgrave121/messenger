import React, { FC, lazy, ReactNode, Suspense } from 'react';
import style from './layout.module.css';

const PopupMessage = lazy(() => import('@entities/Message/ui/PopupMessage/PopupMessage'));
const Slider = lazy(() => import('@features/Slider/ui/Slider/Slider'));

interface IPageLayoutProps {
    children: ReactNode;
}

const PageLayout: FC<IPageLayoutProps> = ({ children }) => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>{children}</div>
            <Suspense>
                <PopupMessage />
                <Slider />
            </Suspense>
        </div>
    );
};

export default PageLayout;
