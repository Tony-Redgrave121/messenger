import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setPopupChildren, setPopupState } from '@entities/Message';
import { fetchMessengerApi, mapMessengerDTO, AdaptMessengerSchema } from '@entities/Messenger';
import { getReactionsApi } from '@entities/Reaction';
import { isServerError, useAppDispatch, useAppSelector, useAbortController } from '@shared/lib';
import { ReactionSchema } from '@shared/types';

const types = ['chat', 'channel', 'group'];

const InitialMessenger: AdaptMessengerSchema = {
    id: '',
    name: '',
    image: '',
    desc: '',
    type: 'chat',
    members: [],
    members_count: 0,
    last_seen: new Date(),
};

const useFetchInitialData = () => {
    const [reactions, setReactions] = useState<ReactionSchema[]>([]);
    const [messenger, setMessenger] = useState<AdaptMessengerSchema>(InitialMessenger);

    const { messengerId, type, postId } = useParams();
    const userId = useAppSelector(state => state.user.userId);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { getSignal } = useAbortController();

    useEffect(() => {
        if (!messengerId || !type) return;
        const signal = getSignal();

        if (!types.includes(type) || !messengerId) {
            navigate('/');
            return;
        }

        const handleFetching = async () => {
            try {
                const [messenger, reactions] = await Promise.all([
                    fetchMessengerApi(userId, type, messengerId, signal),
                    getReactionsApi(
                        type === 'channel' && messengerId ? messengerId : undefined,
                        signal,
                    ),
                ]);

                const adaptMessenger = mapMessengerDTO(messenger.data);

                if (adaptMessenger.id) {
                    setMessenger(adaptMessenger);
                    setReactions(reactions.data);
                }
            } catch (error) {
                const message = isServerError(error);

                dispatch(setPopupState(true));
                dispatch(setPopupChildren(message));
                navigate('/');
            }
        };

        handleFetching();
    }, [messengerId, postId]);

    return {
        messenger,
        setMessenger,
        reactions,
    };
};

export default useFetchInitialData;
