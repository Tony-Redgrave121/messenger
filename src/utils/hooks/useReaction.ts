import MessengerService from "@service/MessengerService";
import {IMessagesResponse, IReaction} from "@appTypes";
import {RefObject} from "react";
import {useAppSelector} from "@hooks/useRedux";
import {useParams} from "react-router-dom";

const useReaction = () => {
    const user_id = useAppSelector(state => state.user.userId)
    const {id} = useParams()

    const reactionOnClick = async (
        message: IMessagesResponse,
        reaction: IReaction,
        socketRef: RefObject<WebSocket | null>
    ) => {
        const messageReaction = message.reactions?.find(react => react.reaction.reaction_id === reaction.reaction_id)

        if (messageReaction?.users_ids.includes(user_id)) {
            await MessengerService.deleteMessageReaction(message.message_id, user_id, reaction.reaction_id)

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    messenger_id: id,
                    user_id: user_id,
                    method: 'REMOVE_REACTION',
                    data: {
                        message_id: message.message_id,
                        user_id: user_id,
                        reaction: reaction,
                        users_ids: messageReaction.users_ids
                    }
                }))
            }
        } else {
            const reactionResponse = await MessengerService.postMessageReaction(message.message_id, user_id, reaction.reaction_id)

            if (reactionResponse.status === 200) {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        messenger_id: id,
                        user_id: user_id,
                        method: 'ADD_REACTION',
                        data: {
                            message_id: message.message_id,
                            user_id: user_id,
                            reaction: reactionResponse.data,
                            users_ids: messageReaction?.users_ids ?? [],
                        }
                    }))
                }
            }
        }
    }

    return {
        reactionOnClick
    }
}

export default useReaction