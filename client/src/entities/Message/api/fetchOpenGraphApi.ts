import { AxiosResponse } from 'axios';
import $api from '@shared/api/axiosApi';
import { OPEN_GRAPH_ROUTE } from '@shared/config';
import { OpenGraphDataSchema } from '@shared/types';

const fetchOpenGraphApi = async (url: string): Promise<AxiosResponse<OpenGraphDataSchema>> => {
    return $api.get<OpenGraphDataSchema>(`${OPEN_GRAPH_ROUTE}?url=${url}`);
};

export default fetchOpenGraphApi;
