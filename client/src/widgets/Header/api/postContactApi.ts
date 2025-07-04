import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {GET_CONTACTS_ROUTE} from "@shared/config";

const postContactApi = async (
    user_id: string,
    contact_id: string,
    signal: AbortSignal
): Promise<AxiosResponse> => {
    return $api.post(GET_CONTACTS_ROUTE.replace(":user_id", user_id), {contact_id}, {signal})
}

export default postContactApi;