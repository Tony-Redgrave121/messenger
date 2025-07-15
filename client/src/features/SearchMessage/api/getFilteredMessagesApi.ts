import { AxiosResponse } from 'axios';
import { MessageSchema } from 'features/Message';
import $api from '@shared/api/axiosApi';
import { SEARCH_MESSAGES_ROUTE } from '@shared/config';

interface IGetMessagesParams {
    query: string;
    type: string;
    user_id: string;
    messenger_id: string;
    post_id?: string;
}

const getFilteredMessagesApi = async (
    params: IGetMessagesParams,
    signal: AbortSignal,
): Promise<AxiosResponse<MessageSchema[]>> => {
    const searchParams = new URLSearchParams({
        query: params.query,
        type: params.type,
        user_id: params.user_id,
        messenger_id: params.messenger_id,
    });

    if (params.post_id) searchParams.append('post_id', params.post_id);

    return $api.get<MessageSchema[]>(`${SEARCH_MESSAGES_ROUTE}?${searchParams.toString()}`, {
        signal,
    });
};

export default getFilteredMessagesApi;
