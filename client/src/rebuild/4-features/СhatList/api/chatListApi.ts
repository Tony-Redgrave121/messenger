import {AxiosResponse} from "axios";
import $api from "../../../shared/api/axiosApi";
import {GET_MESSENGERS_ROUTE} from "../../../shared/config";
import MessengersListSchema from "../../../5-entities/Messenger/model/types/MessengersListSchema";

const chatListApi = async (
    user_id: string,
    signal: AbortSignal
): Promise<AxiosResponse<MessengersListSchema[]>> => {
    return $api.get<MessengersListSchema[]>(
        GET_MESSENGERS_ROUTE.replace(":user_id", user_id),
        {signal}
    )
}

export default chatListApi