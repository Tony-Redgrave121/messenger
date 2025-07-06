import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import style from './style.module.css';
import { Slider } from '@features/Slider';
import { LeftSidebar } from '@widgets/LeftSidebar';

const MainContainer = lazy(() => import('@widgets/Main/ui/Main'));
const PopupMessage = lazy(() => import('@features/PopupMessage/ui/PopupMessage'));

const Layout = () => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>
                <LeftSidebar />
                <Suspense>
                    <MainContainer>
                        <Outlet />
                    </MainContainer>
                </Suspense>
            </div>
            <Suspense>
                <PopupMessage />
                <Slider />
            </Suspense>
        </div>
    );
};

export default Layout;
