import {
    POST_MESSENGER,
    GET_CONTACTS,
    GET_MESSENGER_SETTINGS,
    GET_REACTIONS,
    PUT_MESSENGER_TYPE,
    PUT_MESSENGER_LINK,
    POST_MESSENGER_REACTIONS,
    PUT_MESSENGER_MODERATORS,
    POST_REMOVED,
    POST_CONTACTS_MEMBERS,
    POST_MEMBER, COMMENT
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
    static async putMessengerModerator(member_status: string, user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(`${PUT_MESSENGER_MODERATORS}/${messenger_id}`, {member_status: member_status, user_id: user_id})
    }
    static async postContactsMembers(members: string[], messenger_id: string): Promise<AxiosResponse> {
        return $api.post(`${POST_CONTACTS_MEMBERS}/${messenger_id}`, {members: members})
    }
    static async postMember(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.post(`${POST_MEMBER}/${messenger_id}`, {user_id: user_id})
    }
    static async deleteMember(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.delete(`${POST_MEMBER}/${messenger_id}/${user_id}`)
    }
    static async postRemoved(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.post(`${POST_REMOVED}/${messenger_id}`, {user_id: user_id})
    }
    static async deleteRemoved(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.delete(`${POST_REMOVED}/${messenger_id}/${user_id}`)
    }
    static async putMessenger(messenger: FormData): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.put<IMessengerResponse>(POST_MESSENGER, messenger)
    }
    static async getComments(): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.get<IMessengerResponse>(COMMENT, {

        })
    }
}