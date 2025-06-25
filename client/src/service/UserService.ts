import {
    GET_CONTACTS_ROUTE,
    GET_PROFILE_ROUTE,
    UPDATE_PASSWORD_ROUTE
} from "@utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import {IContact} from "@appTypes"
import IEditProfileForm from "../appTypes/user/IEditProfileForm";

export default class UserService {
    static async getProfile(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IEditProfileForm>> {
        return $api.get<IEditProfileForm>(GET_PROFILE_ROUTE.replace(":user_id", user_id), {signal})
    }
    static async putProfile(user_id: string, formData: FormData): Promise<AxiosResponse<IEditProfileForm>> {
        return $api.put<IEditProfileForm>(GET_PROFILE_ROUTE.replace(":user_id", user_id), formData)
    }
    static async putPassword(user_id: string, formData: FormData): Promise<AxiosResponse> {
        return $api.put(UPDATE_PASSWORD_ROUTE.replace(":user_id", user_id), formData)
    }
    static async getContacts(user_id: string, signal: AbortSignal): Promise<AxiosResponse<IContact[]>> {
        return $api.get<IContact[]>(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {signal})
    }
    static async postContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.post(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {contact_id}, {signal})
    }
    static async deleteContact(user_id: string, contact_id: string, signal: AbortSignal): Promise<AxiosResponse> {
        return $api.delete(`${GET_CONTACTS_ROUTE.replace(":user_id", user_id)}?contact_id=${contact_id}`, {signal})
    }
}