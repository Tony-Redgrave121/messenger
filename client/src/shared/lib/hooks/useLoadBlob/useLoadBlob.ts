import { useEffect, useState } from 'react';
import useAbortController from '@shared/lib/hooks/useAbortController/useAbortController';
import { deleteOldMedias, getMedia, saveMedia } from '@shared/lib/IndexedDB/cweb-account-1';

const SERVER_URL = process.env.VITE_SERVER_URL;

const useLoadBlob = (imagePath?: string, quality?: string) => {
    const [load, setLoad] = useState(false);
    const [image, setImage] = useState('');
    const { getSignal } = useAbortController();

    useEffect(() => {
        if (!imagePath) {
            setLoad(true);
            return;
        }

        let objectUrl = '';
        const signal = getSignal();

        const query = `${SERVER_URL}/${!quality ? 'static/' : ''}${imagePath}${quality ? `?quality=${quality}` : ''}`;

        const loadImage = async () => {
            try {
                if (quality) {
                    const cached = await getMedia(imagePath);
                    if (cached) {
                        objectUrl = URL.createObjectURL(cached);
                        setImage(objectUrl);
                        setLoad(true);

                        return;
                    }
                }

                const response = await fetch(query, { signal });

                if (response.ok) {
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);

                    setImage(objectUrl);

                    if (quality) {
                        await saveMedia(blob, imagePath);
                        await deleteOldMedias(60 * 60 * 24 * 7);
                    }
                }
            } catch (e) {
                const error = e as Error;
                if (error.name !== 'AbortError') console.log(error);
            } finally {
                setLoad(true);
            }
        };

        loadImage();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [imagePath]);

    return {
        load,
        image,
    };
};

export default useLoadBlob;
