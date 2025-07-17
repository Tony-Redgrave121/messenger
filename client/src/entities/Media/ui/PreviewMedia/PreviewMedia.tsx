import React, { FC } from 'react';
import useShortMedia from '@entities/Media/lib/hooks/useShortMedia';
import { FileObjectSchema } from '@shared/types';
import style from '../message-media.module.css';

interface IPreviewMediaProps {
    media: FileObjectSchema;
}

const PreviewMedia: FC<IPreviewMediaProps> = ({ media }) => {
    const { preview } = useShortMedia(media);

    return (
        <>
            {media.url && preview ? (
                <img src={preview} alt="media" />
            ) : (
                <div className={style.ShadowBlock} />
            )}
        </>
    );
};

export default PreviewMedia;
