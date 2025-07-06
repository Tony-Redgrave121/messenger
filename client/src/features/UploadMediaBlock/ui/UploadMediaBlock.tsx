import React, { FC, memo } from 'react';
import style from '../../MessageMediaBlock/ui/style.module.css';
import { PreviewMedia } from '@entities/Media';
import FileObjectSchema from '@entities/Media/model/types/FileObjectSchema';

interface IMedia {
    media: FileObjectSchema[];
}

const UploadMediaBlock: FC<IMedia> = memo(({ media }) => {
    return (
        <div className={style.MediaBlock}>
            <PreviewMedia media={media[0]} key={media[0].url} />
            <span>
                {media.slice(1).map(media => (
                    <PreviewMedia media={media} key={media.url} />
                ))}
            </span>
        </div>
    );
});

export default UploadMediaBlock;
