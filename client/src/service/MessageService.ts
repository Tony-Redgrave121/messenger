import {
    MESSENGER_REACTIONS_ROUTE,
    MESSAGE_REACTIONS_ROUTE,
    CREATE_MESSAGE_ROUTE,
    DELETE_MESSAGE_ROUTE,
    GET_MESSAGES_ROUTE,
} from "@utils/const/const"

import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IMessagesResponse, IReaction} from "@appTypes"

export default class MessageService {
    static async fetchMessages(
        user_id: string,
        type: string,
        messenger_id: string,
        post_id: string | undefined,
        signal: AbortSignal
    ): Promise<AxiosResponse<IMessagesResponse[]>> {
        const query = `?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}${post_id ? `&post_id=${post_id}` : ""}`

        return $api.get<IMessagesResponse[]>(`${GET_MESSAGES_ROUTE.replace(":messenger_id", messenger_id)}${query}`, {signal})
    }
    static async fetchMessage(
        messenger_id: string,
        message_id: string | undefined,
        signal: AbortSignal
    ): Promise<AxiosResponse<IMessagesResponse>> {
        const query = `?messenger_id=${messenger_id}&message_id=${message_id}`
        return $api.get<IMessagesResponse>(`${CREATE_MESSAGE_ROUTE}${query}`, {signal})
    }
    static async postMessage(message: FormData) {
        return $api.post(CREATE_MESSAGE_ROUTE, message)
    }
    static async deleteMessage(message_id: string): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_MESSAGE_ROUTE.replace(":message_id", message_id)}`)
    }
    static async postMessengerReactions(messenger_setting_id: string, reactions: string[]): Promise<AxiosResponse> {
        return $api.post(MESSENGER_REACTIONS_ROUTE.replace(":messenger_setting_id", messenger_setting_id), {reactions})
    }
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
    ): Promise<AxiosResponse<IReaction>> {
        return $api.post(MESSAGE_REACTIONS_ROUTE.replace(":message_id", message_id), {
            user_id,
            reaction_id,
        }, {signal})
    }
}
