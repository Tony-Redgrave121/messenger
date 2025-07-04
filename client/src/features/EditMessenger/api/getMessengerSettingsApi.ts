import {AxiosResponse} from "axios";
import $api from "@shared/api/axiosApi";
import {GET_MESSENGER_SETTINGS_ROUTE} from "@shared/config";
import IMessengerSettings from "@features/EditMessenger/model/types/IMessengerSettings";

const getMessengerSettings = async (
    messenger_id: string,
    signal: AbortSignal
): Promise<AxiosResponse<IMessengerSettings>> => {
    return $api.get<IMessengerSettings>(GET_MESSENGER_SETTINGS_ROUTE.replace(":messenger_id", messenger_id),
        {signal}
    )
}

export default getMessengerSettings;