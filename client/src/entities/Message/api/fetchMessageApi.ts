import {AxiosResponse} from "axios";
import {MessageSchema} from "../index";
import $api from "@shared/api/axiosApi";
import {CREATE_MESSAGE_ROUTE} from "@shared/config";

const fetchMessageApi = async(
    messenger_id: string,
    message_id: string | undefined,
    signal: AbortSignal
): Promise<AxiosResponse<MessageSchema>> => {
    const query = `?messenger_id=${messenger_id}&message_id=${message_id}`
    return $api.get<MessageSchema>(`${CREATE_MESSAGE_ROUTE}${query}`, {signal})
}

export default fetchMessageApi;