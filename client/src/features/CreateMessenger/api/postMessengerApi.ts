import { AxiosResponse } from 'axios';
import { MessengerSchema } from '@entities/Messenger';
import $api from '@shared/api/axiosApi';
import { MESSENGER_ROUTE } from '@shared/config';

const postMessenger = async (
    messenger: FormData,
    signal: AbortSignal,
): Promise<AxiosResponse<MessengerSchema>> => {
    return $api.post<MessengerSchema>(MESSENGER_ROUTE, messenger, { signal });
};

export default postMessenger;
