import { useEffect } from 'react';
import { updateContact } from '@entities/Contact';
import { deleteMessenger, updateMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';
import { addMessenger } from '@entities/Messenger/model/slice/messengerSlice';
import { useAppDispatch, useAppSelector } from '@shared/lib';

let socketInstance: WebSocket | null = null;
let pingInterval: NodeJS.Timeout | null = null;

const SERVER_DOMAIN_NAME = process.env.VITE_SERVER_DOMAIN_NAME;

export const useLiveUpdatesWS = () => {
    const userId = useAppSelector(state => state.user.userId);
    const contacts = useAppSelector(state => state.contact.contacts);

    const dispatch = useAppDispatch();

    const onExit = () => {
        if (!socketInstance) return;

        socketInstance.send(
            JSON.stringify({
                user_id: userId,
                data: {
                    members: contacts.map(c => c.user_id),
                    userId: userId,
                    date: new Date(),
                },
                method: 'EXIT',
            }),
        );
    };

    useEffect(() => {
        if (socketInstance && socketInstance.readyState <= 1) return;
        socketInstance = new WebSocket(`ws://${SERVER_DOMAIN_NAME}/live-updates`);

        socketInstance.onopen = () => {
            socketInstance?.send(
                JSON.stringify({
                    user_id: userId,
                    method: 'CONNECTION',
                }),
            );

            pingInterval = setInterval(() => {
                socketInstance?.send(
                    JSON.stringify({
                        user_id: userId,
                        data: {
                            messenger_members: contacts.map(c => c.user_id),
                            userId: userId,
                            date: new Date(),
                        },
                        method: 'PING',
                    }),
                );
            }, 7500);
        };

        socketInstance.onmessage = event => {
            const message = JSON.parse(event.data);

            switch (message.method) {
                case 'JOIN_TO_MESSENGER':
                    dispatch(addMessenger(message.data));
                    break;
                case 'REMOVE_FROM_MESSENGER':
                    dispatch(deleteMessenger(message.data));
                    break;
                case 'UPDATE_LAST_MESSAGE': {
                    const messageData = message.data;
                    const currentMessengerId = window.location.pathname.split('/').pop();

                    dispatch(
                        updateMessenger({
                            messenger_id: messageData.messenger_id,
                            message_text: messageData.message_text,
                            message_date: messageData.message_date,
                            isCurrentMessenger: messageData.messenger_id === currentMessengerId,
                        }),
                    );
                    break;
                }
                case 'PING': {
                    const messageData = message.data;
                    dispatch(updateContact(messageData));
                    break;
                }
                default:
                    break;
            }
        };

        socketInstance.onclose = () => {
            if (socketInstance?.readyState === WebSocket.CLOSED) onExit();
            if (pingInterval) clearInterval(pingInterval);
        };

        socketInstance.onerror = error => {
            console.error('WebSocket Error:', error);
            if (pingInterval) clearInterval(pingInterval);
        };

        return () => {
            if (socketInstance?.readyState === WebSocket.OPEN) {
                onExit();
                socketInstance.close();
            }

            if (pingInterval) clearInterval(pingInterval);
        };
    }, [dispatch, userId]);

    useEffect(() => {
        const handleExit = () => {
            if (socketInstance?.readyState === WebSocket.OPEN) {
                onExit();
                socketInstance.close();
            }
        };

        window.addEventListener('beforeunload', handleExit);
        return () => window.removeEventListener('beforeunload', handleExit);
    }, [userId]);

    return socketInstance;
};
