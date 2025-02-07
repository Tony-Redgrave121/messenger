// import {
//     LOGIN_ROUTE,
//     LOGOUT_ROUTE,
//     REFRESH_ROUTE,
//     REGISTRATION_ROUTE,
//     DELETE_ACCOUNT_ROUTE,
// } from "../utils/const/const"
import $api from '../http/index'
import {AxiosResponse} from 'axios'
import IMessengerResponse from "../utils/types/IMessengerResponse"

export default class AuthService {
    static async fetchMessengers(user_id: string): Promise<AxiosResponse<IMessengerResponse[]>> {
        return $api.get<IMessengerResponse[]>(`/messengers/${user_id}`)
    }
}