import {
    MESSENGER_REACTIONS_ROUTE,
    MESSAGE_REACTIONS_ROUTE,
} from "@shared/config"

import $api from '@shared/api/axiosApi'
import {AxiosResponse} from 'axios'
import {ReactionSchema} from "@entities/Reaction";

export default class MessageService {
    static async deleteMessageReaction(
        message_id: string,
        user_id: string,
        reaction_id: string,
        signal: AbortSignal
    ): Promise<AxiosResponse> {
        return $api.delete(`${MESSAGE_REACTIONS_ROUTE.replace(":message_id", message_id)}?reaction_id=${reaction_id}&user_id=${user_id}`, {signal})
    }
    static async postMessageReaction(
        message_id: string,
        user_id: string,
        reaction_id: string,
        signal: AbortSignal
    ): Promise<AxiosResponse<ReactionSchema>> {
        return $api.post(MESSAGE_REACTIONS_ROUTE.replace(":message_id", message_id), {
            user_id,
            reaction_id,
        }, {signal})
    }
}
