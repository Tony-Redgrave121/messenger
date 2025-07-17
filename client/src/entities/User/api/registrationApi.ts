import { AxiosResponse } from 'axios';
import AuthSchema from '@entities/User/model/types/AuthSchema';
import $api from '@shared/api/axiosApi';
import { REGISTRATION_ROUTE } from '@shared/config';

const registrationApi = (formData: FormData): Promise<AxiosResponse<AuthSchema>> => {
    return $api.post<AuthSchema>(REGISTRATION_ROUTE, formData);
};

export default registrationApi;
