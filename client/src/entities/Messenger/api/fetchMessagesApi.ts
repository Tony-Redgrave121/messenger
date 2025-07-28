import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { GET_MESSAGES_ROUTE } from '@shared/config';
import { MessageSchema } from '@shared/types';

const fetchMessagesApi = async (
    user_id: string,
    type: string,
    messenger_id: string,
    post_id: string | undefined,
    limit: number | undefined,
    offset: number | undefined,
    signal: AbortSignal,
): Promise<AxiosResponse<MessageSchema[]>> => {
    const query = `?type=${type}&user_id=${user_id}${post_id ? `&post_id=${post_id}` : ''}&limit=${limit}&offset=${offset}`;

    return $api.get<MessageSchema[]>(
        `${GET_MESSAGES_ROUTE.replace(':messenger_id', messenger_id)}${query}`,
        { signal },
    );
};

export default fetchMessagesApi;
