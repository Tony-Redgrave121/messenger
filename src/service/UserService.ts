import {
    DELETE_MESSAGE,
    FETCH_MESSAGES,
    POST_MESSAGE,
} from "../utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import IMessengerResponse from "../types/IMessengerResponse"
import IMessagesResponse from "../types/IMessagesResponse"
import IMessengersListResponse from "../types/IMessengersListResponse"

export default class UserService {
    static async fetchMessenger(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.get<IMessengerResponse>(`/messenger/?user_id=${user_id}&messenger_id=${messenger_id}`, {signal})
    }

    static async fetchMessengersList(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengersListResponse[]>> {
        return $api.get<IMessengersListResponse[]>(`/messengers-list/${user_id}`, {signal})
    }

    static async fetchMessages(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse[]>> {
        return $api.get<IMessagesResponse[]>(`${FETCH_MESSAGES}?user_id=${user_id}&messenger_id=${messenger_id}`, {signal})
    }

    static async postMessage(message: FormData): Promise<AxiosResponse<IMessagesResponse>> {
        return $api.post<IMessagesResponse>(POST_MESSAGE, message)
    }

    static async deleteMessage(message_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_MESSAGE}?message_id=${message_id}&messenger_id=${messenger_id}`)
    }
}