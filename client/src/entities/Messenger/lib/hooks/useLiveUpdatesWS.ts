import { useCallback, useEffect, useRef } from 'react';
import { updateContact } from '@entities/Contact';
import { deleteMessenger, updateMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';
import { addMessenger } from '@entities/Messenger/model/slice/messengerSlice';
import { useAppDispatch, useAppSelector } from '@shared/lib';

const SERVER_DOMAIN_NAME = process.env.VITE_SERVER_DOMAIN_NAME;

export const useLiveUpdatesWS = () => {
    const userId = useAppSelector(state => state.user.userId);
    const contacts = useAppSelector(state => state.contact.contacts);

    const socketRef = useRef<WebSocket | null>(null);
    const pingInterval = useRef<NodeJS.Timeout | null>(null);

    const dispatch = useAppDispatch();
    const contactsRef = useRef(contacts);

    useEffect(() => {
        contactsRef.current = contacts;
    }, [contacts]);

    const onExit = useCallback(() => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        socket.send(
            JSON.stringify({
                user_id: userId,
                data: {
                    messenger_members: contactsRef.current?.map(c => c.user_id),
                    userId: userId,
                    date: new Date(),
                },
                method: 'EXIT',
            }),
        );
    }, [userId, contactsRef]);

    useEffect(() => {
        if (socketRef.current && socketRef.current.readyState <= 1) return;

        socketRef.current = new WebSocket(`ws://${SERVER_DOMAIN_NAME}/live-updates`);
        const socket = socketRef.current;

        socket.onopen = () => {
            socket?.send(
                JSON.stringify({
                    user_id: userId,
                    method: 'CONNECTION',
                }),
            );

            pingInterval.current = setInterval(() => {
                socket?.send(
                    JSON.stringify({
                        user_id: userId,
                        data: {
                            messenger_members: contactsRef.current?.map(c => c.user_id),
                            userId: userId,
                            date: new Date(),
                        },
                        method: 'PING',
                    }),
                );
            }, 7500);
        };

        socket.onmessage = event => {
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
                            message_id: messageData.message_id,
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

        socket.onclose = () => {
            if (pingInterval.current) clearInterval(pingInterval.current);
        };

        socket.onerror = error => {
            console.error('WebSocket Error:', error);
            if (pingInterval.current) clearInterval(pingInterval.current);
        };

        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                onExit();
                socket.close();
            }

            if (pingInterval.current) clearInterval(pingInterval.current);
        };
    }, [dispatch, userId, onExit, contactsRef]);

    useEffect(() => {
        const handleExit = () => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                onExit();
                socketRef.current.close();
            }
        };

        window.addEventListener('beforeunload', handleExit);
        return () => window.removeEventListener('beforeunload', handleExit);
    }, [onExit, userId]);

    return {
        socketRef,
    };
};
