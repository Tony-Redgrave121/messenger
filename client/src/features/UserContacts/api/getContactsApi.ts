import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { GET_CONTACTS_ROUTE } from '@shared/config';
import { ContactSchema } from '@shared/types';

const getContactsApi = async (
    user_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse<ContactSchema[]>> => {
    return $api.get<ContactSchema[]>(GET_CONTACTS_ROUTE.replace(':user_id', user_id), { signal });
};

export default getContactsApi;
