import {
    MESSENGER_ROUTE,
    GET_REACTIONS_ROUTE,
    PRIVATE_CHAT_ROUTE,
    GET_MESSENGERS_ROUTE,
} from "@utils/const/const"

import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IContact, IMessengerResponse, IMessengersListResponse, IReaction} from "@appTypes"

export default class MessengerManagementService {
    static async fetchMessengersList(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengersListResponse[]>> {
        return $api.get<IMessengersListResponse[]>(
            GET_MESSENGERS_ROUTE.replace(":user_id", user_id),
            {signal}
        )
    }

    static async fetchMessenger(user_id: string, type: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse | IContact>> {
        return $api.get<IMessengerResponse | IContact>(
            `${MESSENGER_ROUTE}?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}`,
            {signal}
        )
    }

    static async postMessenger(messenger: FormData, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.post<IMessengerResponse>(MESSENGER_ROUTE, messenger, {signal})
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
