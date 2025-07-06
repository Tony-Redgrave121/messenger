import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { UPDATE_MESSENGER_TYPE_ROUTE } from '@shared/config';

const putMessengerTypeApi = async (type: string, messenger_id: string): Promise<AxiosResponse> => {
    return $api.put(UPDATE_MESSENGER_TYPE_ROUTE.replace(':messenger_id', messenger_id), {
        messenger_type: type,
    });
};

export default putMessengerTypeApi;
