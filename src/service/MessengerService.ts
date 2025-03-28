import {
    POST_MESSENGER,
    GET_CONTACTS,

} from "../utils/const/const"
import $api from '../http/index'
import {AxiosResponse} from 'axios'
import IContact from "../utils/types/IContact";
import IMessengerResponse from "../utils/types/IMessengerResponse";

export default class MessengerService {
    static async getContacts(id: string, signal: AbortSignal): Promise<AxiosResponse<IContact[]>> {
        return $api.get<IContact[]>(`${GET_CONTACTS}/${id}`, {signal})
    }
    static async postMessenger(messenger: FormData): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.post<IMessengerResponse>(POST_MESSENGER, messenger)
    }
}