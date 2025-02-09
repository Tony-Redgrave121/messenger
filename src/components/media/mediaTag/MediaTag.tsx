import React from 'react'
import useLoadFile from "../../../utils/hooks/useLoadFile";
import {useParams} from "react-router-dom";

interface IMediaTag {
    media: {
        message_file_id: string,
        message_file_name: string
    },
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<{
        message_file_id: string,
        message_file_name: string
    }>>,
}

// const isPicture = ['png', 'jpg', 'jpeg', 'webp']
const isVideo = ['mp4', 'webm']

const MediaTag: React.FC<IMediaTag> = ({media, setSlider, setCurrMedia}) => {
    const {id} = useParams()
    const {load, image} = useLoadFile(`messengers/${id}/${media.message_file_name}`)

    const geTag = () => {
        const type = media.message_file_id!.split('.')
        const ext = type[type.length - 1].toLowerCase()

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

export default MediaTag