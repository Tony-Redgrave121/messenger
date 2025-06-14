import {
    MESSENGER_ROUTE,
    GET_CONTACTS_ROUTE,
    GET_MESSENGER_SETTINGS_ROUTE,
    UPDATE_MESSENGER_TYPE_ROUTE,
    UPDATE_MESSENGER_LINK_ROUTE,
    MESSENGER_REACTIONS_ROUTE,
    UPDATE_MESSENGER_MODERATORS_ROUTE,
    ADD_REMOVED_USER_ROUTE,
    ADD_CONTACTS_TO_MESSENGER_ROUTE,
    ADD_MEMBER_ROUTE,
    DELETE_MEMBER_ROUTE,
    GET_REACTIONS_ROUTE,
    MESSAGE_REACTIONS_ROUTE,
    PRIVATE_CHAT_ROUTE, DELETE_REMOVED_USER_ROUTE,
} from "@utils/const/const"

import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IContact, IMessengerResponse, IReaction} from "@appTypes"
import IMessengerSettings from "../appTypes/messenger/IMessengerSettings"

export default class MessengerService {
    static async getContacts(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IContact[]>> {
        return $api.get<IContact[]>(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {signal})
    }

    static async postContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {contact_id}, {signal})
    }

    static async deleteContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${GET_CONTACTS_ROUTE.replace(":user_id", user_id)}?contact_id=${contact_id}`, {signal})
    }

    static async getMessengerSettings(messenger_id: string): Promise<AxiosResponse<IMessengerSettings>> {
        return $api.get<IMessengerSettings>(GET_MESSENGER_SETTINGS_ROUTE.replace(":messenger_id", messenger_id))
    }

    static async getReactions(messenger_id?: string): Promise<AxiosResponse<IReaction[]>> {
        return $api.get<IReaction[]>(`${GET_REACTIONS_ROUTE}${messenger_id ? `?messenger_id=${messenger_id}` : ''}`)
    }

    static async putMessengerType(type: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_TYPE_ROUTE.replace(":messenger_id", messenger_id), {
            messenger_type: type,
        })
    }

    static async putMessengerLink(messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_LINK_ROUTE.replace(":messenger_id", messenger_id))
    }

    static async postMessengerReactions(messenger_setting_id: string, reactions: string[]): Promise<AxiosResponse> {
        return $api.post(MESSENGER_REACTIONS_ROUTE.replace(":messenger_setting_id", messenger_setting_id), {reactions})
    }

    static async putMessengerModerator(member_status: string, user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_MODERATORS_ROUTE.replace(":messenger_id", messenger_id), {
            member_status,
            user_id,
        })
    }

    static async postContactsMembers(members: string[], messenger_id: string): Promise<AxiosResponse> {
        return $api.post(ADD_CONTACTS_TO_MESSENGER_ROUTE.replace(":messenger_id", messenger_id), {members})
    }

    static async postMember(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.post(ADD_MEMBER_ROUTE.replace(":messenger_id", messenger_id), {user_id})
    }

    static async deleteMember(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(DELETE_MEMBER_ROUTE
            .replace(":messenger_id", messenger_id)
            .replace(":user_id", user_id), {signal}
        )
    }

    static async postRemoved(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.post(ADD_REMOVED_USER_ROUTE.replace(":messenger_id", messenger_id), {user_id})
    }

    static async deleteRemoved(user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_REMOVED_USER_ROUTE
            .replace(":messenger_id", messenger_id)
            .replace(":user_id", user_id)}`)
    }

    static async postMessageReaction(message_id: string, user_id: string, reaction_id: string): Promise<AxiosResponse<IReaction>> {
        return $api.post(MESSAGE_REACTIONS_ROUTE.replace(":message_id", message_id), {
            user_id,
            reaction_id,
        })
    }

    static async deleteMessageReaction(message_id: string, user_id: string, reaction_id: string): Promise<AxiosResponse> {
        return $api.delete(`${MESSAGE_REACTIONS_ROUTE.replace(":message_id", message_id)}?reaction_id=${reaction_id}&user_id=${user_id}`)
    }

    static async deleteChat(userId: string, recipientId: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${PRIVATE_CHAT_ROUTE.replace(":user_id", userId)}?recipient_id=${recipientId}`, {signal})
    }

    static async postMessenger(messenger: FormData): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.post<IMessengerResponse>(MESSENGER_ROUTE, messenger)
    }

    static async putMessenger(messenger: FormData): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.put<IMessengerResponse>(MESSENGER_ROUTE, messenger)
    }

    static async deleteMessenger(messengerId: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${MESSENGER_ROUTE}?messenger_id=${messengerId}`, {signal})
    }
}
