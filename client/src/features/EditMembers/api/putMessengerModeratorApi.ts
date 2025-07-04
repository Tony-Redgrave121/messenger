import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {UPDATE_MESSENGER_MODERATORS_ROUTE} from "@shared/config";

const putMessengerModeratorApi = async (
    member_status: string,
    user_id: string,
    messenger_id: string
): Promise<AxiosResponse> => {
    return $api.put(UPDATE_MESSENGER_MODERATORS_ROUTE.replace(":messenger_id", messenger_id), {
        member_status,
        user_id,
    })
}

export default putMessengerModeratorApi;