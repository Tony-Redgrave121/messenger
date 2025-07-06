import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { REGISTRATION_ROUTE } from '@shared/config';
import AuthSchema from '../model/types/AuthSchema';

const registrationApi = (formData: FormData): Promise<AxiosResponse<AuthSchema>> => {
    return $api.post<AuthSchema>(REGISTRATION_ROUTE, formData);
};

export default registrationApi;
