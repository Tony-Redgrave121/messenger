import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { MESSAGE_REACTIONS_ROUTE } from '@shared/config';
import { ReactionSchema } from '@entities/Reaction';

const postMessageReactionApi = async (
    message_id: string,
    user_id: string,
    reaction_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse<ReactionSchema>> => {
    return $api.post(
        MESSAGE_REACTIONS_ROUTE.replace(':message_id', message_id),
        {
            user_id,
            reaction_id,
        },
        { signal },
    );
};

export default postMessageReactionApi;
