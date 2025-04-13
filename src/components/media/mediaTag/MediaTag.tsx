import React, {useEffect, useState} from 'react'
import useLoadFile from "@hooks/useLoadFile";
import {useParams} from "react-router-dom";
import style from './style.module.css'
import {IFileObject, IMessageFile} from "@appTypes";
import {Player} from "@components/player";

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
            const ext = getExt(media.message_file_name)

            const handleClick = (event: React.MouseEvent<HTMLElement | HTMLImageElement>) => {
                event.stopPropagation()
                setCurrMedia && setCurrMedia(media)
                setSlider && setSlider(true)
            }

            if (isVideo.includes(ext))
                return <Player key={media.message_file_id} id={media.message_file_id} src={image} foo={(event) => handleClick(event)}/>
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

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const handlePreview = (media: HTMLImageElement | HTMLVideoElement, canvas: HTMLCanvasElement, width: number, ratio: number) => {
                const height = width / ratio

                canvas.width = width
                canvas.height = height

                ctx.drawImage(media, 0, 0, width, height)
                setPreview(canvas.toDataURL('image/jpeg', .7))
            }

            if (isVideo.includes(ext)) {
                const video = document.createElement('video')
                video.src = media.url
                video.playsInline = true

                video.onloadedmetadata = () => {
                    video.currentTime = 0
                }

                video.onseeked  = () => {
                    const ratio = video.videoWidth / video.videoHeight
                    const width = Math.min(video.videoWidth, MAX_WIDTH)

                    handlePreview(video, canvas, width, ratio)
                }
            } else {
                const image = new Image()
                image.src = media.url

                image.onload = () => {
                    const ratio = image.width / image.height
                    const width = Math.min(image.width, MAX_WIDTH)

                    handlePreview(image, canvas, width, ratio)
                }
            }
        }, [media])

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