import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSchema } from '@entities/Message';
import fetchMessageApi from '@entities/Message/api/fetchMessageApi';
import { useAbortController } from '@shared/lib';

const useFetchPost = (setMessagesList: Dispatch<SetStateAction<MessageSchema[]>>) => {
    const { type, messengerId, postId } = useParams();
    const { getSignal } = useAbortController();
    const [channelPost, setChannelPost] = useState<MessageSchema | null>(null);

    useEffect(() => {
        if (!type || !messengerId || !postId) return;
        const signal = getSignal();

        const handlePostFetching = async () => {
            const data = await fetchMessageApi(messengerId, postId, signal);

            if (data.status === 200) {
                setChannelPost(data.data);
                setMessagesList(prev => [data.data, ...prev]);
            }
        };

        handlePostFetching();
    }, [postId, getSignal, setMessagesList]);

    return { channelPost };
};

export default useFetchPost;
