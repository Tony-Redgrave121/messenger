import React, { FC, ReactNode, useEffect } from 'react';

interface IServiceWorkerProviderProps {
    children: ReactNode;
}

const ServiceWorkerProvider: FC<IServiceWorkerProviderProps> = ({ children }) => {
    useEffect(() => {
        const handleServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('/service-worker.js');
                } catch (e) {
                    console.log('Service worker registration failed', e);
                }
            }
        };

        window.addEventListener('load', handleServiceWorker);
        return () => window.removeEventListener('load', handleServiceWorker);
    }, []);

    return <>{children}</>;
};

export default ServiceWorkerProvider;
