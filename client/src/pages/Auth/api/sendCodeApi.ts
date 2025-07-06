import $api from '@shared/api/axiosApi';
import { SEND_CODE_ROUTE } from '@shared/config';

const sendCodeApi = async (email: string): Promise<void> => {
    return $api.post(SEND_CODE_ROUTE, { email });
};

export default sendCodeApi;
