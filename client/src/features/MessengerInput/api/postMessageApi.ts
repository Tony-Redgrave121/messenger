import $api from '@shared/api/axiosApi';
import { CREATE_MESSAGE_ROUTE } from '@shared/config';

const postMessageApi = async (message: FormData) => {
    return $api.post(CREATE_MESSAGE_ROUTE, message);
};

export default postMessageApi;
