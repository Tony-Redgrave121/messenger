import { useEffect, useState } from 'react';
import { IS_VIDEO } from '@entities/Media/consts/isVideo';
import { MAX_WIDTH } from '@entities/Media/consts/mediaWidth';
import { getExt } from '@shared/lib';
import { FileObjectSchema } from '@shared/types';

const useShortMedia = (media: FileObjectSchema) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!media.url) return;
        const ext = getExt(media.name);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handlePreview = (
            media: HTMLImageElement | HTMLVideoElement,
            canvas: HTMLCanvasElement,
            width: number,
            ratio: number,
        ) => {
            const height = width / ratio;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(media, 0, 0, width, height);
            setPreview(canvas.toDataURL('image/jpeg', 0.7));
        };

        if (IS_VIDEO.includes(ext)) {
            const video = document.createElement('video');
            video.src = media.url;
            video.playsInline = true;

            video.onloadedmetadata = () => {
                video.currentTime = 0;
            };

            video.onseeked = () => {
                const ratio = video.videoWidth / video.videoHeight;
                const width = Math.min(video.videoWidth, MAX_WIDTH);

                handlePreview(video, canvas, width, ratio);
            };
        } else {
            const image = new Image();
            image.src = media.url;

            image.onload = () => {
                const ratio = image.width / image.height;
                const width = Math.min(image.width, MAX_WIDTH);

                handlePreview(image, canvas, width, ratio);
            };
        }
    }, [media]);

    return {
        preview,
    };
};

export default useShortMedia;
