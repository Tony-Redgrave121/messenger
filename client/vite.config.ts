import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv(process.cwd(), '');

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    define: {
        'process.env': env,
    },
    resolve: {
        alias: [
            { find: '@app', replacement: path.resolve(__dirname, 'src/app') },
            { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
            { find: '@widgets', replacement: path.resolve(__dirname, 'src/widgets') },
            {
                find: '@features',
                replacement: path.resolve(__dirname, 'src/features'),
            },
            {
                find: '@entities',
                replacement: path.resolve(__dirname, 'src/entities'),
            },
            { find: '@shared', replacement: path.resolve(__dirname, 'src/shared') },
        ],
    },
    base: '/',
});
