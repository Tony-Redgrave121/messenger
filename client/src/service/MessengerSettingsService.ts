import {
    MESSENGER_ROUTE,
    GET_MESSENGER_SETTINGS_ROUTE,
    UPDATE_MESSENGER_TYPE_ROUTE,
    UPDATE_MESSENGER_LINK_ROUTE,
    UPDATE_MESSENGER_MODERATORS_ROUTE,
    ADD_REMOVED_USER_ROUTE,
    ADD_CONTACTS_TO_MESSENGER_ROUTE,
    ADD_MEMBER_ROUTE,
    DELETE_MEMBER_ROUTE,
    DELETE_REMOVED_USER_ROUTE,
} from "@utils/const/const"

import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IMessengerResponse} from "@appTypes"
import IMessengerSettings from "../appTypes/messenger/IMessengerSettings"

export default class MessengerSettingsService {
    static async getMessengerSettings(messenger_id: string, signal: AbortSignal): Promise<AxiosResponse<IMessengerSettings>> {
        return $api.get<IMessengerSettings>(GET_MESSENGER_SETTINGS_ROUTE.replace(":messenger_id", messenger_id), {signal})
    }
    static async putMessengerType(type: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_TYPE_ROUTE.replace(":messenger_id", messenger_id), {
            messenger_type: type,
        })
    }
    static async putMessengerLink(messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_LINK_ROUTE.replace(":messenger_id", messenger_id))
    }
    static async putMessengerModerator(member_status: string, user_id: string, messenger_id: string): Promise<AxiosResponse> {
        return $api.put(UPDATE_MESSENGER_MODERATORS_ROUTE.replace(":messenger_id", messenger_id), {
            member_status,
            user_id,
        })
    }
    static async postContactsMembers(members: string[], messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(ADD_CONTACTS_TO_MESSENGER_ROUTE.replace(":messenger_id", messenger_id), {members}, {signal})
    }
    static async postMember(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(ADD_MEMBER_ROUTE.replace(":messenger_id", messenger_id), {user_id}, {signal})
    }
    static async deleteMember(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(DELETE_MEMBER_ROUTE
            .replace(":messenger_id", messenger_id)
            .replace(":user_id", user_id), {signal}
        )
    }
    static async postRemoved(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(ADD_REMOVED_USER_ROUTE.replace(":messenger_id", messenger_id), {user_id}, {signal})
    }
    static async deleteRemoved(user_id: string, messenger_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${DELETE_REMOVED_USER_ROUTE
            .replace(":messenger_id", messenger_id)
            .replace(":user_id", user_id)}`, {signal})
    }
    static async putMessenger(messenger: FormData, signal: AbortSignal): Promise<AxiosResponse<IMessengerResponse>> {
        return $api.put<IMessengerResponse>(MESSENGER_ROUTE, messenger, {signal})
    }
}
