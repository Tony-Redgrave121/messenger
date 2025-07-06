import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { addMessenger } from '../../../Messenger/model/slice/messengerSlice';
import { deleteMessenger, updateMessenger } from '../../../Messenger/lib/thunk/messengerThunk';

let socketInstance: WebSocket | null = null;
const SERVER_DOMAIN_NAME = process.env.VITE_SERVER_DOMAIN_NAME;

export const useLiveUpdatesWS = () => {
    const userId = useAppSelector(state => state.user.userId);
    const dispatch = useAppDispatch();

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
        };

        socketInstance.onmessage = event => {
            let message = JSON.parse(event.data);

            switch (message.method) {
                case 'CONNECTION':
                    break;
                case 'JOIN_TO_MESSENGER':
                    dispatch(addMessenger(message.data));
                    break;
                case 'REMOVE_FROM_MESSENGER':
                    dispatch(deleteMessenger(message.data));
                    break;
                case 'UPDATE_LAST_MESSAGE':
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
                default:
                    break;
            }
        };

        socketInstance.onerror = error => {
            console.error('WebSocket Error:', error);
        };
    }, [dispatch, userId]);

    return socketInstance;
};
