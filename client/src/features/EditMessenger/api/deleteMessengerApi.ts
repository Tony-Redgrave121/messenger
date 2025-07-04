import $api from "@shared/api/axiosApi";
import {MESSENGER_ROUTE} from "@shared/config";
import {AxiosResponse} from "axios";

const deleteMessengerApi = async (
    messengerId: string,
    signal: AbortSignal
): Promise<AxiosResponse> => {
    return $api.delete(`${MESSENGER_ROUTE}?messenger_id=${messengerId}`, {signal})
}

export default deleteMessengerApi;