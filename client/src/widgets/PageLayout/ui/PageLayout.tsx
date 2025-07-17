import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LeftSidebar } from '@widgets/LeftSidebar';
import { Slider } from '@features/Slider';
import style from './layout.module.css';

const MainContainer = lazy(() => import('@widgets/Main/ui/Main'));
const PopupMessage = lazy(() => import('@entities/Message/ui/PopupMessage'));

const PageLayout = () => {
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

export default PageLayout;
