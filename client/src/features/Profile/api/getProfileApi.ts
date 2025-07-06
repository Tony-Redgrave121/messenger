import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { GET_PROFILE_ROUTE } from '@shared/config';
import EditProfileSchema from '../model/types/EditProfileSchema';

const getProfileApi = async (
    user_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse<EditProfileSchema>> => {
    return $api.get<EditProfileSchema>(GET_PROFILE_ROUTE.replace(':user_id', user_id), { signal });
};

export default getProfileApi;
