import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessageApi } from '@entities/Message';
import { useAbortController } from '@shared/lib';
import { MessageSchema } from '@shared/types';

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
    }, [postId, setMessagesList]);

    return { channelPost };
};

export default useFetchPost;
