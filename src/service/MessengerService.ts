import {
    POST_MESSENGER,
    GET_CONTACTS,
    GET_MESSENGER_SETTINGS,
    GET_REACTIONS,
    PUT_MESSENGER_TYPE,
    PUT_MESSENGER_LINK,
    POST_MESSENGER_REACTIONS
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IContact, IMessengerResponse, IReaction} from "@appTypes";
import IMessengerSettings from "../appTypes/messenger/IMessengerSettings";

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
    static async putMessengerType(type: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(`${PUT_MESSENGER_TYPE}/${messenger_id}`, {messenger_type: type})
    }
    static async putMessengerLink(messenger_id: string): Promise<AxiosResponse> {
        return $api.put(`${PUT_MESSENGER_LINK}/${messenger_id}`)
    }
    static async postMessengerReactions(messenger_setting_id: string, reactions: string[]): Promise<AxiosResponse> {
        return $api.post(`${POST_MESSENGER_REACTIONS}/${messenger_setting_id}`, {reactions: reactions})
    }
}