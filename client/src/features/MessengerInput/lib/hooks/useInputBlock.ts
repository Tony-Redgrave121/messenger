import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import postMessageApi from '@features/MessengerInput/api/postMessageApi';
import InputBlockSchema from '@features/MessengerInput/model/types/InputBlockSchema';
import { useLiveUpdatesWS } from '@entities/Messenger';
import { getFileObject, useAppSelector } from '@shared/lib';
import { FileStateSchema } from '@shared/types';

const useInputBlock = ({ reply, setReply, socketRef, members }: InputBlockSchema) => {
    const refTextarea = useRef<HTMLTextAreaElement>(null);
    const mediaRef = useRef<HTMLInputElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);
    const filesRef = useRef<File[]>(null);

    const [inputText, setInputText] = useState('');
    const [emoji, setEmoji] = useState(false);
    const [upload, setUpload] = useState(false);
    const [filesState, setFilesState] = useState<FileStateSchema>({
        files: null,
        popup: false,
        type: '',
    });

    const { type, messengerId, postId } = useParams();
    const userId = useAppSelector(state => state.user.userId);
    const liveSocketRef = useLiveUpdatesWS();

    useEffect(() => {
        if (filesState.files) setFilesState(prev => ({ ...prev, popup: true }));
    }, [filesState.files]);

    const resetFileState = () => {
        setFilesState({
            files: null,
            popup: false,
            type: '',
        });
        filesRef.current = null;
    };

    const resetInput = useCallback(() => {
        setInputText('');
        if (refTextarea.current) refTextarea.current.value = '';
        setReply(null);
    }, [setReply]);

    const uploadFiles = (event: ChangeEvent<HTMLInputElement>, type: string) => {
        filesRef.current = Array.from(event.target.files || []);
        const files = getFileObject(event.target.files);

        setFilesState({
            type,
            files,
            popup: true,
        });
    };

    const handleSubmit = useCallback(async () => {
        if (!type || !messengerId || (!filesState.files && !inputText) || !socketRef.current)
            return;

        const formData = new FormData();

        formData.append('message_text', inputText);
        formData.append('message_type', filesState.files ? filesState.type : 'message');
        if (reply) formData.append('reply_id', reply.message_id);
        if (postId) formData.append('post_id', postId);
        formData.append('user_id', userId);
        formData.append(type !== 'chat' ? 'messenger_id' : 'recipient_user_id', messengerId);

        filesRef.current?.forEach(file => formData.append('message_files', file));

        try {
            const newMessage = await postMessageApi(formData);
            if (!newMessage) return;

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                        user_id: userId,
                        method: 'POST_MESSAGE',
                        data: newMessage.data,
                    }),
                );
            }

            if (!postId && liveSocketRef?.readyState === WebSocket.OPEN) {
                const commonData = {
                    message_date: newMessage.data.message_date,
                    message_text: newMessage.data.message_text,
                };

                if (type !== 'chat') {
                    liveSocketRef.send(
                        JSON.stringify({
                            user_id: userId,
                            method: 'UPDATE_LAST_MESSAGE',
                            data: {
                                messenger_id: messengerId,
                                messenger_members: members,
                                ...commonData,
                            },
                        }),
                    );
                } else {
                    const messages = [
                        {
                            messenger_id: messengerId,
                            messenger_members: userId,
                        },
                        {
                            messenger_id: userId,
                            messenger_members: messengerId,
                        },
                    ];

                    messages.forEach(msg => {
                        liveSocketRef.send(
                            JSON.stringify({
                                user_id: userId,
                                method: 'UPDATE_LAST_MESSAGE',
                                data: {
                                    ...msg,
                                    ...commonData,
                                },
                            }),
                        );
                    });
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            resetInput();
            resetFileState();
        }
    }, [
        filesState,
        inputText,
        liveSocketRef,
        members,
        messengerId,
        postId,
        reply,
        resetInput,
        socketRef,
        type,
        userId,
    ]);

    const handleCancel = () => {
        setFilesState(prev => ({ ...prev, popup: false }));
        setTimeout(resetFileState, 300);
    };

    useEffect(() => {
        const textarea = refTextarea.current;
        if (!textarea) return;

        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await handleSubmit();
            }
        };

        textarea.addEventListener('keypress', handleKeyDown);
        return () => textarea.removeEventListener('keypress', handleKeyDown);
    }, [handleSubmit]);

    return {
        mediaRef,
        documentRef,
        setEmoji,
        emoji,
        refTextarea,
        inputText,
        setInputText,
        setUpload,
        upload,
        filesState,
        handleCancel,
        handleSubmit,
        uploadFiles,
        setFilesState,
        filesRef,
    };
};

export default useInputBlock;
