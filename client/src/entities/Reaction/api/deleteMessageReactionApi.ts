import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { MESSAGE_REACTIONS_ROUTE } from '@shared/config';

const deleteMessageReactionApi = async (
    message_id: string,
    user_id: string,
    reaction_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse> => {
    return $api.delete(
        `${MESSAGE_REACTIONS_ROUTE.replace(':message_id', message_id)}?reaction_id=${reaction_id}&user_id=${user_id}`,
        { signal },
    );
};

export default deleteMessageReactionApi;
