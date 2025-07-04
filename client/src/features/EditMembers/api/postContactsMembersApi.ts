import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {ADD_CONTACTS_TO_MESSENGER_ROUTE} from "@shared/config";

const postContactsMembersApi = async (
    members: string[],
    messenger_id: string,
    signal: AbortSignal
): Promise<AxiosResponse> => {
    return $api.post(
        ADD_CONTACTS_TO_MESSENGER_ROUTE.replace(":messenger_id", messenger_id),
        {members},
        {signal}
    )
}

export default postContactsMembersApi;