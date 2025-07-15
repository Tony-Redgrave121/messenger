import { useCallback, useEffect, useRef } from 'react';

const useAbortController = () => {
    const controllerRef = useRef<AbortController | null>(null);

    const getSignal = useCallback(() => {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        return controllerRef.current.signal;
    }, []);

    useEffect(() => {
        return () => controllerRef.current?.abort();
    }, []);

    return {
        getSignal,
    };
};

export default useAbortController;
