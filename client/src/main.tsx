import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@app/App';
import { ErrorBoundary } from '@app/providers/ErrorBoundary';
import { StoreProvider } from '@app/providers/StoreProvider';
import ServiceWorkerProvider from './app/providers/ServiceWorkerProvider/ui/ServiceWorkerProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <StoreProvider>
            <ServiceWorkerProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </ServiceWorkerProvider>
        </StoreProvider>
    </BrowserRouter>,
);
