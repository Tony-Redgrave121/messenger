import { AxiosResponse } from 'axios';
import EditProfileSchema from '@features/Profile/model/types/EditProfileSchema';
import $api from '@shared/api/axiosApi';
import { GET_PROFILE_ROUTE } from '@shared/config';

const putProfileApi = async (
    user_id: string,
    formData: FormData,
): Promise<AxiosResponse<EditProfileSchema>> => {
    return $api.put<EditProfileSchema>(GET_PROFILE_ROUTE.replace(':user_id', user_id), formData);
};

export default putProfileApi;
