import fetchOpenGraphApi from '@entities/Message/api/fetchOpenGraphApi';
import OpenGraphDataSchema from '@shared/types/OpenGraphDataSchema';

const fetchOgData = async (url: string): Promise<OpenGraphDataSchema | null> => {
    try {
        const og = await fetchOpenGraphApi(url);
        const data = og.data;

        return {
            siteName: data.siteName,
            title: data.title,
            description: data.description,
            image: data.image,
            url: data.url,
        };
    } catch (e) {
        console.log(e);
        return null;
    }
};

export default fetchOgData;
