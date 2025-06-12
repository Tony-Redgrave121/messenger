import {
    DELETE_MESSAGE,
    FETCH_MESSAGES,
    PROFILE,
    PASSWORD,
    MESSAGE,
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IMessengerResponse, IMessagesResponse, IMessengersListResponse, IProfileSettings, IContact} from "@appTypes"
import ApiError from "../../server/error/ApiError";

export default class UserService {
    static async fetchMessenger(user_id: string, type: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse | IContact | ApiError>> {
        return $api.get<IMessengerResponse | IContact | ApiError>(`/messenger/?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}`, {signal})
    }
    static async fetchMessengersList(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengersListResponse[]>> {
        return $api.get<IMessengersListResponse[]>(`/messengers-list/${user_id}`, {signal})
    }
    static async fetchMessages(user_id: string, type: string, messenger_id: string, post_id: string | undefined, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse[]>> {
        return $api.get<IMessagesResponse[]>(`${FETCH_MESSAGES}?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}${post_id ? `&post_id=${post_id}` : ''}`, {signal})
    }
    static async fetchMessage(messenger_id: string, message_id: string | undefined, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse>> {
        return $api.get<IMessagesResponse>(`${MESSAGE}?messenger_id=${messenger_id}&message_id=${message_id}`, {signal})
    }
    static async postMessage(message: FormData): Promise<AxiosResponse<IMessagesResponse>> {
        return $api.post<IMessagesResponse>(MESSAGE, message)
    }
    static async deleteMessage(message_id: string): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_MESSAGE}?message_id=${message_id}`)
    }
    static async getProfile(user_id: string): Promise<AxiosResponse<IProfileSettings>> {
        return $api.get(`${PROFILE}/${user_id}`)
    }
    static async putProfile(user_id: string, formData: FormData): Promise<AxiosResponse<IProfileSettings>> {
        return $api.put(`${PROFILE}/${user_id}`, formData)
    }
    static async putPassword(user_id: string, formData: FormData): Promise<AxiosResponse> {
        return $api.put(`${PASSWORD}/${user_id}`, formData)
    }
}