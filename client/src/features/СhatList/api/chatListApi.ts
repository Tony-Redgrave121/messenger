import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {GET_MESSENGERS_ROUTE} from "@shared/config";
import ChatBlockSchema from "@entities/Messenger/model/types/ChatBlockSchema";

const chatListApi = async (
    user_id: string,
    signal: AbortSignal
): Promise<AxiosResponse<ChatBlockSchema[]>> => {
    return $api.get<ChatBlockSchema[]>(
        GET_MESSENGERS_ROUTE.replace(":user_id", user_id),
        {signal}
    )
}

export default chatListApi