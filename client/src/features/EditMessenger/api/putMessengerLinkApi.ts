import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { UPDATE_MESSENGER_LINK_ROUTE } from '@shared/config';

const putMessengerLinkApi = async (messenger_id: string): Promise<AxiosResponse> => {
    return $api.put(UPDATE_MESSENGER_LINK_ROUTE.replace(':messenger_id', messenger_id));
};

export default putMessengerLinkApi;
