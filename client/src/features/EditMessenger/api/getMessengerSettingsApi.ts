import { AxiosResponse } from 'axios';
import { MessengerSettingsSchema } from '@entities/Messenger';
import $api from '@shared/api/axiosApi';
import { GET_MESSENGER_SETTINGS_ROUTE } from '@shared/config';

const getMessengerSettingsApi = async (
    messenger_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse<MessengerSettingsSchema>> => {
    return $api.get<MessengerSettingsSchema>(
        GET_MESSENGER_SETTINGS_ROUTE.replace(':messenger_id', messenger_id),
        { signal },
    );
};

export default getMessengerSettingsApi;
