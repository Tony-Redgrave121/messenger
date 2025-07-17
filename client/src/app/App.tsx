import { Suspense, useEffect } from 'react';
import { updateIsLoading, userCheckAuth } from '@entities/User';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { AppRouter } from './providers/RouterProvider';

function App() {
    const isLoading = useAppSelector(state => state.user.isLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) dispatch(userCheckAuth());
        else dispatch(updateIsLoading(false));
    }, [dispatch]);

    if (isLoading) return <></>;

    return (
        <Suspense>
            <AppRouter />
        </Suspense>
    );
}

export default App;
