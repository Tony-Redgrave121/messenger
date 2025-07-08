import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLayout } from '@widgets/PageLayout';
import { useAppSelector } from '@shared/lib';
import { routerConfig } from '../index';

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
            <Route path="/" element={<PageLayout />}>
                {routerConfig.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to={'/'} />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
