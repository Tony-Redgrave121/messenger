import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useMessageContext } from '@features/Message/lib/hooks/useMessageContext';
import { handleContextMenu, useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';

const useMessage = (
    message: MessageSchema,
    viewedIds: string[],
    setViewedIds: Dispatch<SetStateAction<string[]>>,
) => {
    const [contextMenu, setContextMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [animation, setAnimation] = useState(false);

    const userId = useAppSelector(state => state.user.userId);
    const { messenger } = useMessageContext();

    const isOwner = useMemo(() => {
        return message.user_id === userId && messenger.type !== 'channel';
    }, [message.user_id, messenger.type, userId]);

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        return handleContextMenu({
            event,
            setPosition,
            setContextMenu,
            height: 100,
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (viewedIds.includes(message.message_id)) return;
            setAnimation(true);

            const markAsViewed = setTimeout(() => {
                setViewedIds(prev => [...prev, message.message_id]);
            }, 200);

            return () => clearTimeout(markAsViewed);
        }, 200);

        return () => clearTimeout(timeout);
    }, []);

    return {
        contextMenu,
        setContextMenu,
        animation,
        isOwner,
        position,
        messenger,
        onContextMenu,
    };
};
export default useMessage;
