import { RefObject } from 'react';
import { useAppSelector } from '@shared/lib';
import { useParams } from 'react-router-dom';
import { useAbortController } from '@shared/lib';
import { MessageSchema } from '../../../Message';
import { ReactionSchema } from '@entities/Reaction';
import deleteMessageReactionApi from '@entities/Reaction/api/deleteMessageReactionApi';
import postMessageReactionApi from '@entities/Reaction/api/postMessageReactionApi';

const useReaction = () => {
    const user_id = useAppSelector(state => state.user.userId);
    const { messengerId, postId } = useParams();
    const { getSignal } = useAbortController();

    const reactionOnClick = async (
        message: MessageSchema,
        reaction: ReactionSchema,
        socketRef: RefObject<WebSocket | null>,
    ) => {
        const messageReaction = message.reactions?.find(
            react => react.reaction.reaction_id === reaction.reaction_id,
        );
        const signal = getSignal();

        if (messageReaction?.users_ids.includes(user_id)) {
            await deleteMessageReactionApi(
                message.message_id,
                user_id,
                reaction.reaction_id,
                signal,
            );

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                        user_id: user_id,
                        method: 'REMOVE_REACTION',
                        data: {
                            message_id: message.message_id,
                            user_id: user_id,
                            reaction: reaction,
                            users_ids: messageReaction.users_ids,
                        },
                    }),
                );
            }
        } else {
            const reactionResponse = await postMessageReactionApi(
                message.message_id,
                user_id,
                reaction.reaction_id,
                signal,
            );

            if (reactionResponse.status === 200) {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(
                        JSON.stringify({
                            messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                            user_id: user_id,
                            method: 'ADD_REACTION',
                            data: {
                                message_id: message.message_id,
                                user_id: user_id,
                                reaction: reactionResponse.data,
                                users_ids: messageReaction?.users_ids ?? [],
                            },
                        }),
                    );
                }
            }
        }
    };

    return {
        reactionOnClick,
    };
};

export default useReaction;
