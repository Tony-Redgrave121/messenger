import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';

const SERVER_DOMAIN_NAME = process.env.VITE_SERVER_DOMAIN_NAME;

const useMessageWS = (setTotalCount: Dispatch<SetStateAction<number>>) => {
    const [messagesList, setMessagesList] = useState<MessageSchema[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const user = useAppSelector(state => state.user);
    const { messengerId, postId } = useParams();

    useEffect(() => {
        if (!messengerId) return;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
            socketRef.current.close();

        socketRef.current = new WebSocket(`ws://${SERVER_DOMAIN_NAME}/messenger`);
        const socket = socketRef.current;

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                    user_id: user.userId,
                    method: 'CONNECTION',
                }),
            );
        };

        socket.onmessage = event => {
            const message = JSON.parse(event.data);

            switch (message.method) {
                case 'CONNECTION':
                    break;
                case 'POST_MESSAGE':
                    setTotalCount(prev => prev + 1);
                    setMessagesList(prev => [...prev, message.data]);
                    break;
                case 'REMOVE_MESSAGE':
                    setTotalCount(prev => prev - 1);
                    setMessagesList(prev => prev.filter(msg => msg.message_id !== message.data));
                    break;
                case 'ADD_REACTION':
                    setMessagesList(prev =>
                        prev.map(msg => {
                            if (msg.message_id === message.data.message_id) {
                                const updatedReactions =
                                    msg.reactions?.map(react => {
                                        if (
                                            react.reaction.reaction_id ===
                                            message.data.reaction.reaction_id
                                        ) {
                                            return {
                                                users_ids: [
                                                    ...message.data.users_ids,
                                                    message.data.user_id,
                                                ],
                                                reaction_count: (
                                                    parseInt(react.reaction_count) + 1
                                                ).toString(),
                                                reaction: {
                                                    ...react.reaction,
                                                },
                                            };
                                        }
                                        return react;
                                    }) ?? [];

                                const exists = updatedReactions.some(
                                    r =>
                                        r.reaction.reaction_id ===
                                        message.data.reaction.reaction_id,
                                );

                                if (!exists) {
                                    updatedReactions.push({
                                        users_ids: [
                                            ...message.data.users_ids,
                                            message.data.user_id,
                                        ],
                                        reaction_count: '1',
                                        reaction: {
                                            ...message.data.reaction,
                                        },
                                    });
                                }

                                return {
                                    ...msg,
                                    reactions: updatedReactions,
                                };
                            }
                            return msg;
                        }),
                    );
                    break;
                case 'REMOVE_REACTION':
                    setMessagesList(prev =>
                        prev.map(msg => {
                            if (msg.message_id === message.data.message_id) {
                                const updatedReactions = msg.reactions
                                    ?.map(react => {
                                        if (
                                            react.reaction.reaction_id ===
                                            message.data.reaction.reaction_id
                                        ) {
                                            const newCount = parseInt(react.reaction_count) - 1;
                                            if (newCount <= 0) return null;

                                            return {
                                                users_ids: message.data.users_ids.filter(
                                                    (id: string) => id !== message.data.user_id,
                                                ),
                                                reaction_count: newCount.toString(),
                                                reaction: {
                                                    ...react.reaction,
                                                },
                                            };
                                        }
                                        return react;
                                    })
                                    .filter(Boolean) as typeof msg.reactions;

                                return {
                                    ...msg,
                                    reactions: updatedReactions,
                                };
                            }

                            return msg;
                        }),
                    );
                    break;
                case 'EDIT_MESSAGE':
                    setMessagesList(prev =>
                        prev.map(msg =>
                            msg.message_id === message.data.message_id
                                ? { ...msg, message_text: message.data.message_text }
                                : msg,
                        ),
                    );
                    break;
                default:
                    break;
            }
        };

        socket.onerror = error => {
            console.error('WebSocket Error:', error);
        };

        return () => {
            if (socket.readyState === 1) socket.close();
        };
    }, [user.userId, messengerId, postId, setTotalCount]);

    return {
        socketRef,
        messagesList,
        setMessagesList,
    };
};

export default useMessageWS;
