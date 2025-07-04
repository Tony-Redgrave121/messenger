import {AxiosResponse} from "axios";
import {ContactSchema} from "@entities/Contact";
import $api from "@shared/api/axiosApi";
import {MESSENGER_ROUTE} from "@shared/config";
import MessengerSchema from "@entities/Messenger/model/types/MessengerSchema";

const fetchMessengerApi = async (
    user_id: string,
    type: string,
    messenger_id: string,
    signal: AbortSignal
): Promise<AxiosResponse<MessengerSchema | ContactSchema>> => {
    return $api.get<MessengerSchema | ContactSchema>(
        `${MESSENGER_ROUTE}?type=${type}&user_id=${user_id}&messenger_id=${messenger_id}`,
        {signal}
    )
}

export default fetchMessengerApi;