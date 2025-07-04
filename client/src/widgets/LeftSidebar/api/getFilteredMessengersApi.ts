import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {SEARCH_MESSENGERS_ROUTE} from "@shared/config";
import MessengerInfoSchema from "@widgets/LeftSidebar/model/types/MessengerInfoSchema";
import ChatInfoSchema from "@widgets/LeftSidebar/model/types/ChatInfoSchema";

const getFilteredMessengersApi = async (
    query: string,
    type: string,
    signal: AbortSignal
): Promise<AxiosResponse<MessengerInfoSchema[] | ChatInfoSchema[]>> => {
    return $api.get<MessengerInfoSchema[] | ChatInfoSchema[]>(
        `${SEARCH_MESSENGERS_ROUTE}?query=${query}&type=${type}`,
        {signal}
    )
}

export default getFilteredMessengersApi;