import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {DELETE_MESSAGE_ROUTE} from "@shared/config";

const deleteMessageApi = async (
    message_id: string
): Promise<AxiosResponse> => {
    return $api.delete(`${DELETE_MESSAGE_ROUTE.replace(":message_id", message_id)}`)
}

export default deleteMessageApi;