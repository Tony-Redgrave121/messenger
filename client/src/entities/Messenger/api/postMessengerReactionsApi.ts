import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {MESSENGER_REACTIONS_ROUTE} from "@shared/config";

const postMessengerReactionsApi = async (
    messenger_setting_id: string,
    reactions: string[]
): Promise<AxiosResponse> => {
    return $api.post(MESSENGER_REACTIONS_ROUTE
        .replace(":messenger_setting_id", messenger_setting_id),
        {reactions}
    )
}

export default postMessengerReactionsApi;