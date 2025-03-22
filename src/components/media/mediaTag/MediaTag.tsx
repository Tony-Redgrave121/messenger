import React, {useEffect, useState} from 'react'
import useLoadFile from "../../../utils/hooks/useLoadFile";
import {useParams} from "react-router-dom";
import style from './style.module.css'
import IFileObject from "../../../utils/types/IFileObject";
import IMessageFile from "../../../utils/types/IMessageFile";

interface IMediaTag {
    media: IMessageFile
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<IMessageFile>>
}

interface IInputBlockProps {
    media: IFileObject
}

// const isPicture = ['png', 'jpg', 'jpeg', 'webp']
const isVideo = ['mp4', 'webm']

namespace MediaTag {
    const getExt = (name: string) => {
        const type = name.split('.')

        return type[type.length - 1].toLowerCase()
    }

    export const Slider: React.FC<IMediaTag> = ({media, setSlider, setCurrMedia}) => {
        const {id} = useParams()

        let {load, image} = useLoadFile(`messengers/${id}/${media.message_file_name}`)

        const geTag = () => {
            const ext = getExt(media.message_file_id)

            const handleClick = (event: React.MouseEvent<HTMLVideoElement | HTMLImageElement>) => {
                event.stopPropagation()
                setCurrMedia && setCurrMedia(media)
                setSlider && setSlider(true)
            }

            if (isVideo.includes(ext))
                return <video src={image} key={media.message_file_id} id={media.message_file_id} onClick={(event) => handleClick(event)}></video>
            else
                return <img src={image} alt="media" key={media.message_file_id} id={media.message_file_id} onClick={(event) => handleClick(event)} draggable={'false'}/>
        }

        return (
            <>
                {(load && image) ? geTag() : <div/>}
            </>
        )
    }

    export const InputBlock: React.FC<IInputBlockProps> = ({media}) => {
        const [preview, setPreview] = useState<string | null>(null)
        const MAX_WIDTH = 700

        useEffect(() => {
            if (!media.url) return
            const ext = getExt(media.name)

            if (isVideo.includes(ext)) setPreview(media.url)
            else {
                const image = new Image()
                image.src = media.url

                image.onload = () => {
                    const ratio = image.width / image.height
                    const width = Math.min(image.width, MAX_WIDTH)
                    const height = width / ratio

                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    if (!ctx) return

                    canvas.width = width
                    canvas.height = height

                    ctx.drawImage(image, 0, 0, width, height)
                    setPreview(canvas.toDataURL('image/jpeg', .7))
                }
            }
        }, [media])

        return (
            <>
                {(media.url && preview) ?
                    (
                        isVideo.includes(getExt(media.name)) ?
                            <video src={preview} controls/>
                            :
                            <img src={preview} alt="media"/>
                    ) :
                    (
                        <div className={style.ShadowBlock}/>
                    )
                }
            </>
        )
    }
}


export default MediaTag