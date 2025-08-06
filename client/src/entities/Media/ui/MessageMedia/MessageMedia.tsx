import React, { FC } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { IS_VIDEO } from '@entities/Media/consts/isVideo';
import { setCurrentSlide, setMessageId, setState } from '@entities/Media/model/slice/sliderSlice';
import { getExt, useAppDispatch, useLoadBlob } from '@shared/lib';
import { MessageFileSchema } from '@shared/types';
import style from './media.module.css';

interface IMessageMediaProps {
    media: MessageFileSchema;
    messageId: string;
}

export const MessageMedia: FC<IMessageMediaProps> = ({ media, messageId }) => {
    const { load, image } = useLoadBlob(
        `messengers/${media.message_file_path}/${media.message_file_name}`,
        'low',
    );

    const ext = getExt(media.message_file_name);
    const dispatch = useAppDispatch();

    const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
        event.stopPropagation();

        dispatch(setCurrentSlide(media));
        dispatch(setMessageId(messageId));
        dispatch(setState(true));
    };

    return (
        <>
            {load ? (
                <button className={style.MediaButton} onClick={handleClick}>
                    <img src={image} alt="media" />
                    {IS_VIDEO.includes(ext) && <HiPlay />}
                </button>
            ) : (
                <div className={`${style.ShadowBlock} ${style.MinBlock}`} />
            )}
        </>
    );
};

export default MessageMedia;
