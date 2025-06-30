import {
    SEARCH_MESSENGERS_ROUTE,
    SEARCH_MESSAGES_ROUTE
} from "../rebuild/shared/config/router/router"
import $api from '../rebuild/shared/api/axiosApi'
import {AxiosResponse} from 'axios'
import {IChatInfo, IMessagesResponse, IMessengerInfo} from "@appTypes";

interface IGetMessagesParams {
    query: string,
    type: string,
    user_id: string,
    messenger_id: string,
    post_id?: string,
}

export default class SearchService {
    static async getMessengers(query: string, type: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerInfo[] | IChatInfo[]>> {
        return $api.get<IMessengerInfo[] | IChatInfo[]>(`${SEARCH_MESSENGERS_ROUTE}?query=${query}&type=${type}`, {signal})
    }
    static async getMessages(params: IGetMessagesParams, signal: AbortSignal): Promise<AxiosResponse<IMessagesResponse[]>> {
        return $api.get<IMessagesResponse[]>(`${SEARCH_MESSAGES_ROUTE}?query=${params.query}&type=${params.type}&user_id=${params.user_id}&messenger_id=${params.messenger_id}${params.post_id ? `&post_id=${params.post_id}` : ''}`, {signal})
    }
}