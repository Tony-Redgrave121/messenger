import React from 'react'
import useLoadFile from "../../../utils/hooks/useLoadFile";
import {useParams} from "react-router-dom";

interface IMedia {
    message_file_id: string,
    message_file_name: string
}

interface IMediaTag {
    media: IMedia
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<{
        message_file_id: string,
        message_file_name: string
    }>>
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

    export const InputBlock: React.FC<{media: IMedia}> = ({media}) => {
        const geTag = () => {
            const ext = getExt(media.message_file_id)

            if (isVideo.includes(ext))
                return <video src={media.message_file_name} key={media.message_file_id} id={media.message_file_id}></video>
            else
                return <img src={media.message_file_name} alt="media" key={media.message_file_id} id={media.message_file_id}/>
        }

        return (
            <>
                {media.message_file_name ? geTag() : <div/>}
            </>
        )
    }
}


export default MediaTag