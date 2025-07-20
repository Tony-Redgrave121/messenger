import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import routerConfig from '@app/providers/RouterProvider/config/routerConfig';
import { LeftSidebar } from '@widgets/LeftSidebar';
import { Main } from '@widgets/Main';
import { PageLayout } from '@widgets/PageLayout';
import { useAppSelector } from '@shared/lib';

const AuthPage = lazy(() => import('@pages/AuthPage/ui/AuthPage'));

const AppRouter = () => {
    const isAuth = useAppSelector(state => state.user.isAuth);

    if (!isAuth) {
        return (
            <Routes>
                <Route path="*" element={<AuthPage />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PageLayout>
                        <LeftSidebar />
                        <Main>
                            <Suspense>
                                <Outlet />
                            </Suspense>
                        </Main>
                    </PageLayout>
                }
            >
                {routerConfig.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to={'/'} />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
