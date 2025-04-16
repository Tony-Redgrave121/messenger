import React, {Dispatch, FC, SetStateAction} from 'react'
import useLoadBlob from "@hooks/useLoadBlob";
import {useParams} from "react-router-dom";
import style from './style.module.css'
import {IFileObject, IMessageFile} from "@appTypes";
import {Player} from "@components/player";
import getExt from "@utils/logic/getExt";
import useShortMedia from "@hooks/useShortMedia";

interface ISliderProps {
    media: IMessageFile
}

interface IMessageMediaProps extends ISliderProps {
    media: IMessageFile
    setSlider: (state: boolean) => void,
    setCurrMedia: Dispatch<SetStateAction<IMessageFile>>
}

interface IInputBlockProps {
    media: IFileObject
}

// const isPicture = ['png', 'jpg', 'jpeg', 'webp']
const isVideo = ['mp4', 'webm']

namespace MediaTag {
    export const Slider: FC<ISliderProps> = ({media}) => {
        const {id} = useParams()
        let {load, image} = useLoadBlob(`messengers/${id}/${media.message_file_name}`)

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
        const {id} = useParams()
        let {load, image} = useLoadBlob(`messengers/${id}/${media.message_file_name}`)

        const fileObj = {
            url: image,
            name: media.message_file_name,
            size: media.message_file_size,
        }

        const {preview} = useShortMedia(fileObj)

        const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
            event.stopPropagation()
            setCurrMedia(media)
            setSlider(true)
        }

        return (
            <>
                {(load && preview) ?
                    <img src={preview} alt="media" onClick={handleClick}/>
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