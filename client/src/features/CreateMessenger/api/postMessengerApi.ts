import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {MESSENGER_ROUTE} from "@shared/config";
import MessengerSchema from "@entities/Messenger/model/types/MessengerSchema";

const postMessenger = async (
    messenger: FormData,
    signal: AbortSignal
): Promise<AxiosResponse<MessengerSchema>> => {
    return $api.post<MessengerSchema>(MESSENGER_ROUTE, messenger, {signal})
}

export default postMessenger;