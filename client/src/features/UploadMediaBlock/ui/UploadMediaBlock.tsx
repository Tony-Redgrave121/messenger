import React, { FC, memo } from 'react';
import { FileObjectSchema, PreviewMedia } from '@entities/Media';
import style from './upload-media-block.module.css';

interface IMedia {
    media: FileObjectSchema[];
}

const UploadMediaBlock: FC<IMedia> = memo(({ media }) => {
    return (
        <div className={style.UploadMediaBlock}>
            <PreviewMedia media={media[0]} key={media[0].url} />
            <span>
                {media.slice(1).map(media => (
                    <PreviewMedia media={media} key={media.url} />
                ))}
            </span>
        </div>
    );
});

UploadMediaBlock.displayName = 'UploadMediaBlock';

export default UploadMediaBlock;
