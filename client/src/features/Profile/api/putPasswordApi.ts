import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { UPDATE_PASSWORD_ROUTE } from '@shared/config';

const putPasswordApi = async (user_id: string, formData: FormData): Promise<AxiosResponse> => {
    return $api.put(UPDATE_PASSWORD_ROUTE.replace(':user_id', user_id), formData);
};

export default putPasswordApi;
