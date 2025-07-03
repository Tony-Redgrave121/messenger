import {
    GET_CONTACTS_ROUTE,
} from "@shared/config"
import $api from '@shared/api/axiosApi'
import {AxiosResponse} from 'axios'
import {ContactSchema} from "@entities/Contact";

export default class UserService {

    static async getContacts(user_id: string, signal: AbortSignal): Promise<AxiosResponse<ContactSchema[]>> {
        return $api.get<ContactSchema[]>(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {signal})
    }
    static async postContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {contact_id}, {signal})
    }
    static async deleteContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${GET_CONTACTS_ROUTE.replace(":user_id", user_id)}?contact_id=${contact_id}`, {signal})
    }
}