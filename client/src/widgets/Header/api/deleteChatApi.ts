import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { PRIVATE_CHAT_ROUTE } from '@shared/config';

const deleteChatApi = async (
    userId: string,
    recipientId: string,
    signal: AbortSignal,
): Promise<AxiosResponse> => {
    return $api.delete(
        `${PRIVATE_CHAT_ROUTE.replace(':user_id', userId)}?recipient_id=${recipientId}`,
        { signal },
    );
};

export default deleteChatApi;
