import {
    MESSENGER_ROUTE,
    GET_REACTIONS_ROUTE,
    PRIVATE_CHAT_ROUTE,
} from "@shared/config"

import $api from '@shared/api/axiosApi'
import {AxiosResponse} from 'axios'
import {IMessengerResponse, IReaction} from "@appTypes"
import {ContactSchema} from "@entities/Contact";

export default class MessengerManagementService {
    static async fetchMessenger(user_id: string, type: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse | ContactSchema>> {
        return $api.get<IMessengerResponse | ContactSchema>(
            `${MESSENGER_ROUTE}?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}`,
            {signal}
        )
    }

    static async deleteMessenger(messengerId: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${MESSENGER_ROUTE}?messenger_id=${messengerId}`, {signal})
    }

    static async getReactions(messenger_id: string | undefined, signal: AbortSignal): Promise<AxiosResponse<IReaction[]>> {
        return $api.get<IReaction[]>(`${GET_REACTIONS_ROUTE}${messenger_id ? `?messenger_id=${messenger_id}` : ''}`, {signal})
    }

    static async deleteChat(userId: string, recipientId: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${PRIVATE_CHAT_ROUTE
            .replace(":user_id", userId)}?recipient_id=${recipientId}`, {signal})
    }
}
