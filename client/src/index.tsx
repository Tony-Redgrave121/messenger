import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './rebuild/1-app/App'
import {ErrorBoundary} from "./rebuild/1-app/providers/ErrorBoundary";
import {BrowserRouter} from "react-router-dom";
import {StoreProvider} from "./rebuild/1-app/providers/StoreProvider";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <BrowserRouter>
        <StoreProvider>
            <ErrorBoundary>
                <App/>
            </ErrorBoundary>
        </StoreProvider>
    </BrowserRouter>
)