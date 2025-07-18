import React, { FC } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { IS_VIDEO } from '@entities/Media/consts/isVideo';
import useShortMedia from '@entities/Media/lib/hooks/useShortMedia';
import { setCurrentSlide, setMessageId, setState } from '@entities/Media/model/slice/sliderSlice';
import { getExt, useAppDispatch, useLoadBlob } from '@shared/lib';
import { MessageFileSchema } from '@shared/types';
import { PlayButton } from '@shared/ui';
import style from './message-media.module.css';

interface IMessageMediaProps {
    media: MessageFileSchema;
    messageId: string;
}

export const MessageMedia: FC<IMessageMediaProps> = ({ media, messageId }) => {
    const { load, image } = useLoadBlob(
        `messengers/${media.message_file_path}/${media.message_file_name}`,
    );
    const ext = getExt(media.message_file_name);

    const dispatch = useAppDispatch();

    const fileObj = {
        url: image,
        name: media.message_file_name,
        size: media.message_file_size,
    };

    const { preview } = useShortMedia(fileObj);

    const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
        event.stopPropagation();

        dispatch(setCurrentSlide(media));
        dispatch(setMessageId(messageId));
        dispatch(setState(true));
    };

    return (
        <>
            {load && preview ? (
                <div className={style.MediaBlock} onClick={handleClick}>
                    <img src={preview} alt="media" />
                    {IS_VIDEO.includes(ext) && (
                        <PlayButton>
                            <HiPlay />
                        </PlayButton>
                    )}
                </div>
            ) : (
                <div className={`${style.ShadowBlock} ${style.MinBlock}`} />
            )}
        </>
    );
};

export default MessageMedia;
