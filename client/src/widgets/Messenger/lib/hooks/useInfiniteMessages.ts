import { RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setPopupChildren, setPopupState, useMessageWS } from '@entities/Message';
import { fetchMessagesApi } from '@entities/Messenger';
import { isServerError, useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';

const useInfiniteMessages = (refContainer: RefObject<HTMLElement | null>) => {
    const [totalCount, setTotalCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [firstMount, setFirstMount] = useState(true);

    const offsetRef = useRef(0);
    const { socketRef, messagesList, setMessagesList } = useMessageWS();

    const userId = useAppSelector(state => state.user.userId);
    const { getSignal } = useAbortController();
    const navigate = useNavigate();
    const { messengerId, type, postId } = useParams();
    const dispatch = useAppDispatch();

    const handleFetching = async () => {
        if (
            !messengerId ||
            !type ||
            isFetching ||
            (messagesList.length >= totalCount && !firstMount)
        )
            return;

        setIsFetching(true);
        setFirstMount(false);

        const signal = getSignal();

        try {
            const messages = await fetchMessagesApi(
                userId,
                type,
                messengerId,
                postId,
                5,
                offsetRef.current,
                signal,
            );

            const newMessages = messages.data;

            setMessagesList(prev => [...newMessages, ...prev]);
            offsetRef.current += newMessages.length;

            const total = Number(messages.headers['x-total-count']);
            setTotalCount(total);
        } catch (error) {
            const message = isServerError(error);

            if (message) {
                dispatch(setPopupState(true));
                dispatch(setPopupChildren(message));
                navigate('/');
            }
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!refContainer.current) return;

        const container = refContainer.current;
        const virtuosoList = container.querySelector('[data-testid="virtuoso-item-list"]');

        const timeout = setTimeout(() => {
            const contentHeight = virtuosoList?.clientHeight ?? 0;
            const containerHeight = container.clientHeight;

            if (
                contentHeight > 0 &&
                contentHeight < containerHeight &&
                offsetRef.current < totalCount &&
                !isFetching
            ) {
                handleFetching();
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [messagesList]);

    useEffect(() => {
        offsetRef.current = 0;
        setTotalCount(0);
        setMessagesList([]);
        setFirstMount(true);
    }, [messengerId, type, postId, setMessagesList]);

    return {
        messagesList,
        setMessagesList,
        socketRef,
        handleFetching,
        totalCount,
    };
};

export default useInfiniteMessages;
