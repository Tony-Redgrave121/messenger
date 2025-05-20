import React, {Dispatch, FC, SetStateAction} from 'react'
import useLoadBlob from "@hooks/useLoadBlob";
import style from './style.module.css'
import {IAnimationState, IFileObject, IMessageFile} from "@appTypes";
import {Player} from "@components/player";
import getExt from "@utils/logic/getExt";
import useShortMedia from "@hooks/useShortMedia";
import Buttons from "@components/buttons/Buttons";
import {HiPlay} from "react-icons/hi2";

interface ISliderProps {
    media: IMessageFile
}

interface IMessageMediaProps extends ISliderProps {
    media: IMessageFile
    setSlider: Dispatch<SetStateAction<IAnimationState>>,
    setCurrMedia: Dispatch<SetStateAction<IMessageFile>>
}

interface IInputBlockProps {
    media: IFileObject
}

// const isPicture = ['png', 'jpg', 'jpeg', 'webp']
const isVideo = ['mp4', 'webm']

namespace MediaTag {
    export const Slider: FC<ISliderProps> = ({media}) => {
        let {load, image} = useLoadBlob(`messengers/${media.message_file_path}/${media.message_file_name}`)

        const handlePropagation = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation()
        }

        const geTag = () => {
            const ext = getExt(media.message_file_name)

            if (isVideo.includes(ext))
                return <Player key={media.message_file_id} id={media.message_file_id} src={image} foo={handlePropagation}/>
            else
                return <img src={image} alt="media" key={media.message_file_id} id={media.message_file_id} draggable={'false'} onClick={handlePropagation}/>
        }

        return (
            <>
                {(load && image) ? geTag() : <div className={`${style.ShadowBlock} ${style.MinBlock}`}/>}
            </>
        )
    }

    export const MessageMedia: FC<IMessageMediaProps> = ({media, setSlider, setCurrMedia}) => {
        let {load, image} = useLoadBlob(`messengers/${media.message_file_path}/${media.message_file_name}`)
        const ext = getExt(media.message_file_name)

        const fileObj = {
            url: image,
            name: media.message_file_name,
            size: media.message_file_size,
        }

        const {preview} = useShortMedia(fileObj)

        const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
            event.stopPropagation()
            setCurrMedia(media)
            setSlider({
                state: true,
                mounted: true
            })
        }

        return (
            <>
                {(load && preview) ?
                    <div className={style.MediaBlock} onClick={handleClick}>
                        <img src={preview} alt="media"/>
                        {isVideo.includes(ext) &&
                            <Buttons.PlayerButton className='PlayButton'>
                                <HiPlay/>
                            </Buttons.PlayerButton>
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