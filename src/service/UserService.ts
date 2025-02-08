import {
    FETCH_MESSAGES,
} from "../utils/const/const"
import $api from '../http/index'
import {AxiosResponse} from 'axios'
import IMessengerResponse from "../utils/types/IMessengerResponse"
import IMessagesResponse from "../utils/types/IMessagesResponse"

export default class AuthService {
    static async fetchMessengers(user_id: string): Promise<AxiosResponse<IMessengerResponse[]>> {
        return $api.get<IMessengerResponse[]>(`/messengers/${user_id}`)
    }

    static async fetchMessages(user_id: string, messenger_id: string): Promise<AxiosResponse<IMessagesResponse[]>> {
        return $api.get<IMessagesResponse[]>(`${FETCH_MESSAGES}?user_id=${user_id}&messenger_id=${messenger_id}`)
    }
}