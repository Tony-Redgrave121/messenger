import {
    POST_MESSENGER,
    GET_CONTACTS,
    GET_MESSENGER_SETTINGS,
    GET_REACTIONS
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IContact, IMessengerResponse, IReaction} from "@appTypes";
import IMessengerSettings from "../appTypes/IMessengerSettings";

export default class MessengerService {
    static async getContacts(id: string, signal: AbortSignal): Promise<AxiosResponse<IContact[]>> {
        return $api.get<IContact[]>(`${GET_CONTACTS}/${id}`, {signal})
    }
    static async postMessenger(messenger: FormData): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.post<IMessengerResponse>(POST_MESSENGER, messenger)
    }
    static async getMessengerSettings(messenger_id: string): Promise<AxiosResponse<IMessengerSettings>> {
        return $api.get<IMessengerSettings>(`${GET_MESSENGER_SETTINGS}/${messenger_id}`)
    }
    static async getReactions(): Promise<AxiosResponse<IReaction[]>> {
        return $api.get<IReaction[]>(GET_REACTIONS)
    }
}