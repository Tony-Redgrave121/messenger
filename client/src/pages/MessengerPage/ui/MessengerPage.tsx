import React, { lazy, Suspense } from 'react';
import { MessengerHeader } from '@widgets/Header';
import { Messenger } from '@widgets/Messenger';

const RightSidebar = lazy(() => import('@widgets/RightSidebar/ui/RightSidebar/RightSidebar'));

const MessengerPage = () => {
    return (
        <>
            <Messenger>
                <MessengerHeader />
            </Messenger>
            <Suspense>
                <RightSidebar />
            </Suspense>
        </>
    );
};

export default MessengerPage;
