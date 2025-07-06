import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { REFRESH_ROUTE } from '@shared/config';
import AuthSchema from '../model/types/AuthSchema';

const checkAuthApi = (): Promise<AxiosResponse<AuthSchema>> => {
    return $api.get<AuthSchema>(REFRESH_ROUTE);
};

export default checkAuthApi;
