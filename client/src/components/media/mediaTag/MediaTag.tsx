import React, {FC} from 'react'
import useLoadBlob from "@utils/hooks/useLoadBlob";
import style from './style.module.css'
import {IFileObject, IMessageFile} from "@appTypes";
import {Player} from "@components/player";
import useShortMedia from "@utils/hooks/useShortMedia";
import {HiPlay} from "react-icons/hi2";
import {PlayButton} from "../../../rebuild/shared/ui/Button";
import {useAppDispatch, getExt} from "../../../rebuild/shared/lib";
import {setCurrentSlide, setMessageId, setState} from "@store/reducers/sliderReducer";

interface ISliderProps {
    media: IMessageFile
}

interface IMessageMediaProps extends ISliderProps {
    messageId: string;
}

interface IInputBlockProps {
    media: IFileObject
}

// const isPicture = ['png', 'jpg', 'jpeg', 'webp']
const isVideo = ['mp4', 'webm']

namespace MediaTag {
    export const Slider: FC<ISliderProps> = ({media}) => {
        const {load, image} = useLoadBlob(`messengers/${media.message_file_path}/${media.message_file_name}`)

        const handlePropagation = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation()
        }

        const geTag = () => {
            const ext = getExt(media.message_file_name)

            if (isVideo.includes(ext)) {
                return <Player
                    key={media.message_file_id}
                    id={media.message_file_id}
                    src={image}
                    foo={handlePropagation}
                />
            } else {
                return <img
                    src={image}
                    alt="media"
                    key={media.message_file_id}
                    id={media.message_file_id}
                    draggable={'false'}
                    onClick={handlePropagation}
                />
            }
        }

        return (
            <>
                {(load && image) ? geTag() : <div className={`${style.ShadowBlock} ${style.MinBlock}`}/>}
            </>
        )
    }

    export const MessageMedia: FC<IMessageMediaProps> = ({media, messageId}) => {
        const {load, image} = useLoadBlob(`messengers/${media.message_file_path}/${media.message_file_name}`)
        const ext = getExt(media.message_file_name)

        const dispatch = useAppDispatch()

        const fileObj = {
            url: image,
            name: media.message_file_name,
            size: media.message_file_size,
        }

        const {preview} = useShortMedia(fileObj)

        const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
            event.stopPropagation()

            dispatch(setCurrentSlide(media))
            dispatch(setMessageId(messageId))
            dispatch(setState(true))
        }

        return (
            <>
                {(load && preview) ?
                    <div className={style.MediaBlock} onClick={handleClick}>
                        <img src={preview} alt="media"/>
                        {isVideo.includes(ext) &&
                            <PlayButton>
                                <HiPlay/>
                            </PlayButton>
                        }
                    </div>
                    :
                    <div className={`${style.ShadowBlock} ${style.MinBlock}`}/>
                }
            </>
        )
    }

    export const InputBlock: React.FC<IInputBlockProps> = ({media}) => {
        const {preview} = useShortMedia(media)

        return (
            <>
                {(media.url && preview) ?
                    <img src={preview} alt="media"/>
                    :
                    <div className={style.ShadowBlock}/>
                }
            </>
        )
    }
}


export default MediaTag