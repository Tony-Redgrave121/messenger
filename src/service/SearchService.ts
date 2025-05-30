import {
    SEARCH_MESSENGERS,
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IChatInfo, IMessengerInfo} from "@appTypes";

export default class SearchService {
    static async getMessengers(query: string, type: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerInfo[] | IChatInfo[]>> {
        return $api.get<IMessengerInfo[] | IChatInfo[]>(`${SEARCH_MESSENGERS}?query=${query}&type=${type}`, {signal})
    }
}