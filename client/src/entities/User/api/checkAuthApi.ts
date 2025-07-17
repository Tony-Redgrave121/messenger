import { AxiosResponse } from 'axios';
import AuthSchema from '@entities/User/model/types/AuthSchema';
import $api from '@shared/api/axiosApi';
import { REFRESH_ROUTE } from '@shared/config';

const checkAuthApi = (): Promise<AxiosResponse<AuthSchema>> => {
    return $api.get<AuthSchema>(REFRESH_ROUTE);
};

export default checkAuthApi;
