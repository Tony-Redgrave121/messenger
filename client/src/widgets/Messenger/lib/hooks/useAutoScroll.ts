import { RefObject, useEffect } from 'react';
import { MessageSchema } from '@shared/types';

const useAutoScroll = (refEnd: RefObject<HTMLDivElement | null>, messagesList: MessageSchema[]) => {
    useEffect(() => {
        const timeout = setTimeout(
            () => refEnd.current?.scrollIntoView({ behavior: 'smooth' }),
            300,
        );
        return () => clearTimeout(timeout);
    }, [messagesList]);

    return useAutoScroll;
};

export default useAutoScroll;
