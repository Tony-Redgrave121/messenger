import {
    CREATE_MESSAGE_ROUTE, DELETE_MESSAGE_ROUTE,
    GET_MESSAGES_ROUTE,
    GET_MESSENGERS_ROUTE, GET_PROFILE_ROUTE,
    MESSENGER_ROUTE, UPDATE_PASSWORD_ROUTE
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IMessengerResponse, IMessagesResponse, IMessengersListResponse, IProfileSettings, IContact} from "@appTypes"
import ApiError from "../../server/error/ApiError";

export default class UserService {
    static async fetchMessenger(user_id: string, type: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse | IContact | ApiError>> {
        return $api.get<IMessengerResponse | IContact | ApiError>(
            `${MESSENGER_ROUTE}?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}`,
            {signal}
        )
    }

    static async fetchMessengersList(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengersListResponse[]>> {
        return $api.get<IMessengersListResponse[]>(
            GET_MESSENGERS_ROUTE.replace(":user_id", user_id),
            {signal}
        )
    }

    static async fetchMessages(user_id: string, type: string, messenger_id: string, post_id: string | undefined, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse[]>> {
        const query = `?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}${post_id ? `&post_id=${post_id}` : ""}`

        return $api.get<IMessagesResponse[]>(`${GET_MESSAGES_ROUTE.replace(":messenger_id", messenger_id)}${query}`, {signal})
    }

    static async fetchMessage(messenger_id: string, message_id: string | undefined, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse>> {
        const query = `?messenger_id=${messenger_id}&message_id=${message_id}`
        return $api.get<IMessagesResponse>(`${CREATE_MESSAGE_ROUTE}${query}`, {signal})
    }

    static async postMessage(message: FormData): Promise<AxiosResponse<IMessagesResponse>> {
        return $api.post<IMessagesResponse>(CREATE_MESSAGE_ROUTE, message)
    }

    static async deleteMessage(message_id: string): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_MESSAGE_ROUTE.replace(":message_id", message_id)}`)
    }

    static async getProfile(user_id: string): Promise<AxiosResponse<IProfileSettings>> {
        return $api.get<IProfileSettings>(GET_PROFILE_ROUTE.replace(":user_id", user_id))
    }

    static async putProfile(user_id: string, formData: FormData): Promise<AxiosResponse<IProfileSettings>> {
        return $api.put<IProfileSettings>(GET_PROFILE_ROUTE.replace(":user_id", user_id), formData)
    }

    static async putPassword(user_id: string, formData: FormData): Promise<AxiosResponse> {
        return $api.put(UPDATE_PASSWORD_ROUTE.replace(":user_id", user_id), formData)
    }
}