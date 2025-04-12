import {
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    REFRESH_ROUTE,
    REGISTRATION_ROUTE,
    DELETE_ACCOUNT_ROUTE,
    SEND_CODE_ROUTE, CONFIRM_EMAIL_ROUTE
} from "../utils/const/const"
import $api from '@utils/http/index'
import {AxiosResponse} from 'axios'
import IAuthResponse from "../types/IAuthResponse"

export default class AuthService {
    static async sendCode(email: string): Promise<AxiosResponse> {
        return $api.post(SEND_CODE_ROUTE, {email})
    }

    static async confirmEmail(user_code: number, user_email: string): Promise<AxiosResponse> {
        return $api.post(CONFIRM_EMAIL_ROUTE, {user_code, user_email})
    }

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