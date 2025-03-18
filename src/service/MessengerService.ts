import {
    POST_MESSENGER,
    GET_CONTACTS,

} from "../utils/const/const"
import $api from '../http/index'
import {AxiosResponse} from 'axios'
import IMessagesResponse from "../utils/types/IMessagesResponse"
import IContact from "../utils/types/IContact";

export default class MessengerService {
    static async getContacts(id: string): Promise<AxiosResponse<IContact[]>> {
        return $api.get<IContact[]>(`${GET_CONTACTS}/${id}`)
    }
    static async postMessenger(messenger: FormData): Promise<AxiosResponse<IMessagesResponse>> {
        return $api.post<IMessagesResponse>(POST_MESSENGER, messenger)
    }
}