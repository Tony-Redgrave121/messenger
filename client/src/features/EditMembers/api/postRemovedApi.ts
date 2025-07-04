import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {ADD_REMOVED_USER_ROUTE} from "@shared/config";

const postRemovedApi = async (
    user_id: string,
    messenger_id: string,
    signal: AbortSignal
): Promise<AxiosResponse> => {
    return $api.post(ADD_REMOVED_USER_ROUTE.replace(":messenger_id", messenger_id), {user_id}, {signal})
}

export default postRemovedApi;