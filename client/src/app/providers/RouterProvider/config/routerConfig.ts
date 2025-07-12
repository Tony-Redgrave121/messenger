import { lazy } from 'react';

const MessengerPage = lazy(() => import('@pages/MessengerPage/ui/MessengerPage'));
const PostPage = lazy(() => import('@pages/PostPage/ui/PostPage'));

const routerConfig = [
    {
        path: ':type/:messengerId',
        Component: MessengerPage,
    },
    {
        path: ':type/:messengerId/post/:postId',
        Component: PostPage,
    },
];

export default routerConfig;
