import debounce from 'debounce';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import getReactionsApi from '@entities/Messenger/api/getReactionsApi';
import postMessengerReactionsApi from '@entities/Messenger/api/postMessengerReactionsApi';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useAbortController } from '@shared/lib';
import { ReactionSchema } from '@shared/types';

const useEditReactions = (
    messengerSettingsId: string,
    channelReactions: string[],
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>,
    state: boolean,
) => {
    const [availableReactions, setAvailableReactions] = useState<string[]>([]);
    const [activeReactions, setActiveReactions] = useState<ReactionSchema[]>([]);
    const { getSignal } = useAbortController();

    useEffect(() => {
        setAvailableReactions(channelReactions);
    }, []);

    useEffect(() => {
        const signal = getSignal();

        const fetchReactions = async () => {
            try {
                const res = await getReactionsApi(undefined, signal);
                setActiveReactions(res.data);
            } catch (e) {
                console.log(e);
            }
        };

        fetchReactions();
    }, []);

    const debouncePost = useCallback(
        debounce(async (reactions: string[]) => {
            if (!messengerSettingsId) return;

            try {
                const res = await postMessengerReactionsApi(messengerSettingsId, reactions);

                setSettings(prev => ({
                    ...prev,
                    reactions: res.data,
                }));
            } catch (error) {
                console.log(error);
            }
        }, 1500),
        [messengerSettingsId],
    );

    useEffect(() => {
        if (state) debouncePost(availableReactions);
    }, [availableReactions]);

    const toggleAll = () => {
        if (availableReactions.length > 0) {
            setAvailableReactions([]);
        } else {
            setAvailableReactions(activeReactions.map(r => r.reaction_id));
        }
    };

    const toggleOne = (reactionId: string) => {
        if (availableReactions.includes(reactionId)) {
            setAvailableReactions(prev => [...prev.filter(el => el !== reactionId)]);
        } else {
            setAvailableReactions(prev => [...prev, reactionId]);
        }
    };

    return {
        availableReactions,
        activeReactions,
        toggleAll,
        toggleOne,
    };
};

export default useEditReactions;
