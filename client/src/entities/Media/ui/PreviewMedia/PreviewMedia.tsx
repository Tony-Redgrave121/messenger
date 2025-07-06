import React, { FC } from 'react';
import useShortMedia from '../../lib/hooks/useShortMedia';
import style from '../MessageMedia/style.module.css';
import FileObjectSchema from '../../model/types/FileObjectSchema';

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
