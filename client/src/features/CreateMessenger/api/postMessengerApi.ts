import {AxiosResponse} from "axios";
import {IMessengerResponse} from "@appTypes";
import $api from "@shared/api/axiosApi";
import {MESSENGER_ROUTE} from "@shared/config";

const postMessenger = async (
    messenger: FormData,
    signal: AbortSignal
): Promise<AxiosResponse<IMessengerResponse>> => {
    return $api.post<IMessengerResponse>(MESSENGER_ROUTE, messenger, {signal})
}

export default postMessenger;