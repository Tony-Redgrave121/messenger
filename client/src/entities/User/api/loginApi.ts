import { AxiosResponse } from 'axios';
import AuthSchema from '@entities/User/model/types/AuthSchema';
import $api from '@shared/api/axiosApi';
import { LOGIN_ROUTE } from '@shared/config';
import { ApiError } from '@shared/types';

const loginApi = async (formData: FormData): Promise<AxiosResponse<AuthSchema | ApiError>> => {
    return $api.post<AuthSchema | ApiError>(LOGIN_ROUTE, formData);
};

export default loginApi;
