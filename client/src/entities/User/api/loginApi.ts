import {AxiosResponse} from "axios";
import AuthSchema from "../model/types/AuthSchema";
import $api from "@shared/api/axiosApi";
import {LOGIN_ROUTE} from "@shared/config";

const loginApi = (
    formData: FormData
): Promise<AxiosResponse<AuthSchema>> => {
    return $api.post<AuthSchema>(LOGIN_ROUTE, formData)
}

export default loginApi;