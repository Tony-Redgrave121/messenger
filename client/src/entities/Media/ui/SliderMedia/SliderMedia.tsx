import React, { FC } from 'react';
import { IS_VIDEO } from '@entities/Media/consts/isVideo';
import Player from '@entities/Media/ui/Player/Player';
import { getExt, useLoadBlob } from '@shared/lib';
import { MessageFileSchema } from '@shared/types';
import style from '../message-media.module.css';

interface ISliderProps {
    media: MessageFileSchema;
}

const SliderMedia: FC<ISliderProps> = ({ media }) => {
    const { load, image } = useLoadBlob(
        `messengers/${media.message_file_path}/${media.message_file_name}`,
    );

    const handlePropagation = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };

    const geTag = () => {
        const ext = getExt(media.message_file_name);

        if (IS_VIDEO.includes(ext)) {
            return (
                <Player
                    key={media.message_file_id}
                    id={media.message_file_id}
                    src={image}
                    foo={handlePropagation}
                />
            );
        } else {
            return (
                <img
                    src={image}
                    alt="media"
                    key={media.message_file_id}
                    id={media.message_file_id}
                    draggable={'false'}
                    onClick={handlePropagation}
                />
            );
        }
    };

    return (
        <>
            {load && image ? geTag() : <div className={`${style.ShadowBlock} ${style.MinBlock}`} />}
        </>
    );
};

export default SliderMedia;
