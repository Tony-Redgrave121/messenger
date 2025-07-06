import { lazy } from 'react';

const Messenger = lazy(() => import('@pages/Messenger/Messenger'));
const CommentsBlock = lazy(() => import('@pages/ChannelPost/ChannelPost'));

const routerConfig = [
    {
        path: ':type/:messengerId',
        Component: Messenger,
    },
    {
        path: ':type/:messengerId/post/:postId',
        Component: CommentsBlock,
    },
];

export default routerConfig;
