import {AxiosResponse} from "axios";
import MessengerSchema from "@entities/Messenger/model/types/MessengerSchema";
import $api from "@shared/api/axiosApi";
import {MESSENGER_ROUTE} from "@shared/config";

const putMessengerApi = async (
    messenger: FormData,
    signal: AbortSignal
): Promise<AxiosResponse<MessengerSchema>> => {
    return $api.put<MessengerSchema>(MESSENGER_ROUTE, messenger, {signal})
}

export default putMessengerApi;