import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@app/App';
import { ErrorBoundary } from '@app/providers/ErrorBoundary';
import { ServiceWorkerProvider } from '@app/providers/ServiceWorkerProvider';
import { StoreProvider } from '@app/providers/StoreProvider';

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
