import { AxiosResponse } from 'axios';
import { ReactionSchema } from '@entities/Reaction';
import $api from '@shared/api/axiosApi';
import { GET_REACTIONS_ROUTE } from '@shared/config';

const getReactionsApi = async (
    messenger_id: string | undefined,
    signal: AbortSignal,
): Promise<AxiosResponse<ReactionSchema[]>> => {
    return $api.get<ReactionSchema[]>(
        `${GET_REACTIONS_ROUTE}${messenger_id ? `?messenger_id=${messenger_id}` : ''}`,
        { signal },
    );
};

export default getReactionsApi;
