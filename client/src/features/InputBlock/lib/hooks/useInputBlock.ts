import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getFileObject, useAppSelector } from '@shared/lib';
import { useParams } from 'react-router-dom';
import { useLiveUpdatesWS } from '@entities/Reaction/lib/hooks/useLiveUpdatesWS';
import postMessageApi from '../../api/postMessageApi';
import InputBlockSchema from '../../model/types/InputBlockSchema';
import FileStateSchema from '@entities/Media/model/types/FileStateSchema';

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

    const resetInput = () => {
        setInputText('');
        refTextarea.current && (refTextarea.current.value = '');
        setReply(null);
    };

    const uploadFiles = (event: ChangeEvent<HTMLInputElement>, type: string) => {
        filesRef.current = Array.from(event.target.files || []);
        const files = getFileObject(event.target.files);

        setFilesState({
            type,
            files,
            popup: true,
        });
    };

    const handleSubmit = async () => {
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
                liveSocketRef.send(
                    JSON.stringify({
                        user_id: userId,
                        method: 'UPDATE_LAST_MESSAGE',
                        data: {
                            messenger_id: type !== 'chat' ? messengerId : userId,
                            message_date: newMessage.data.message_date,
                            message_text: newMessage.data.message_text,
                            messenger_members: members,
                        },
                    }),
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
            resetInput();
            resetFileState();
        }
    };

    const handleCancel = () => {
        setFilesState(prev => ({ ...prev, popup: false }));
        setTimeout(resetFileState, 300);
    };

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
