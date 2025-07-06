import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { GET_CONTACTS_ROUTE } from '@shared/config';

const deleteContactApi = async (
    user_id: string,
    contact_id: string,
    signal: AbortSignal,
): Promise<AxiosResponse> => {
    return $api.delete(
        `${GET_CONTACTS_ROUTE.replace(':user_id', user_id)}?contact_id=${contact_id}`,
        { signal },
    );
};

export default deleteContactApi;
