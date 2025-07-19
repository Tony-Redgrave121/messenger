import React, { useEffect, useRef, useState } from 'react';
import { useMessageContext } from '@features/Message/lib/hooks/useMessageContext';
import { getTitle, handleContextMenu, useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';

const useMessage = (message: MessageSchema) => {
    const [contextMenu, setContextMenu] = useState(false);
    const [animation, setAnimation] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const refLink = useRef<HTMLAnchorElement>(null);
    const userId = useAppSelector(state => state.user.userId);
    const { messenger } = useMessageContext();

    useEffect(() => {
        const timeout = setTimeout(() => setAnimation(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setIsOwner(message.user_id === userId && messenger.type !== 'channel');
    }, [message.user_id, messenger.type, userId]);

    const onEntered = () => {
        getTitle(refLink, message.user.user_name, 'color');
    };

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        return handleContextMenu({
            event,
            setPosition,
            setContextMenu,
            height: 100,
        });
    };

    return {
        contextMenu,
        setContextMenu,
        animation,
        isOwner,
        position,
        refLink,
        messenger,
        onEntered,
        onContextMenu,
    };
};

export default useMessage;
