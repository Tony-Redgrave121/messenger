import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { CONFIRM_EMAIL_ROUTE } from '@shared/config';

const confirmEmailApi = (user_code: number, user_email: string): Promise<AxiosResponse> => {
    return $api.post(CONFIRM_EMAIL_ROUTE, { user_code, user_email });
};

export default confirmEmailApi;
