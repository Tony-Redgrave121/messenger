import React, { FC } from 'react';
import { FileObjectSchema } from '@entities/Media';
import useShortMedia from '../../lib/hooks/useShortMedia';
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
