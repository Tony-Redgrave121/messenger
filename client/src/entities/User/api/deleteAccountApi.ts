import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { DELETE_ACCOUNT_ROUTE } from '@shared/config';

const deleteAccountApi = (user_id: string): Promise<AxiosResponse<{ user_id: string }>> => {
    return $api.post(DELETE_ACCOUNT_ROUTE, { user_id });
};

export default deleteAccountApi;
