import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { DELETE_REMOVED_USER_ROUTE } from '@shared/config';

const deleteRemovedApi = async (
    user_id: string,
    messenger_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse> => {
    return $api.delete(
        `${DELETE_REMOVED_USER_ROUTE.replace(':messenger_id', messenger_id).replace(
            ':user_id',
            user_id,
        )}`,
        { signal },
    );
};

export default deleteRemovedApi;
