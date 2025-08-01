import { useEffect, useState } from 'react';
import useAbortController from '@shared/lib/hooks/useAbortController/useAbortController';

const SERVER_URL = process.env.VITE_SERVER_URL;

const useLoadBlob = (imagePath?: string | boolean, quality?: string) => {
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

        fetch(`${SERVER_URL}/${!quality ? 'static/' : ''}${imagePath}?quality=${quality}`, {
            signal,
        })
            .then(data => data.blob())
            .then(blob => {
                objectUrl = URL.createObjectURL(blob);
                setImage(objectUrl);
            })
            .catch(error => {
                if (error.name !== 'AbortError') console.log(error);
            })
            .finally(() => setLoad(true));

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
