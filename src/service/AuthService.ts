import {
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    REFRESH_ROUTE,
    REGISTRATION_ROUTE,
    DELETE_ACCOUNT_ROUTE,
} from "../utils/const/const"
import $api from '../http/index'
import {AxiosResponse} from 'axios'
import IAuthResponse from "../utils/types/IAuthResponse"

export default class AuthService {
    static async login(formData: FormData): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>(LOGIN_ROUTE, formData)
    }

    static async registration(formData: FormData): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>(REGISTRATION_ROUTE, formData)
    }

    static async logout(): Promise<void> {
        return $api.post(LOGOUT_ROUTE)
    }

    static async deleteAccount(user_id: string): Promise<AxiosResponse<{user_id: string}>> {
        return $api.post(DELETE_ACCOUNT_ROUTE, {user_id})
    }

    static async userCheckAuth(): Promise<AxiosResponse<IAuthResponse>> {
        return $api.get<IAuthResponse>(REFRESH_ROUTE)
    }
}