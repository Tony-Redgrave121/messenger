import React, {memo} from 'react'
import style from "./style.module.css"

interface IMediaBlock {
    media: Array<{
        message_file_id: string,
        message_file_name: string
    }>,
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<{
        message_file_id: string,
        message_file_name: string
    }>>,
}

const MediaBlock: React.FC<IMediaBlock> = memo(({media, setSlider, setCurrMedia}) => {
    const getTag = (currMedia: { message_file_id: string, message_file_name: string }) => {
        const isPicture = ['png', 'jpg', 'jpeg', 'webp']
        const isVideo = ['mp4', 'webm']

        const type = currMedia.message_file_id!.split('.')
        const ext = type[type.length - 1]

        if (isVideo.includes(ext)) {
            return (
                <video src={currMedia.message_file_name} key={currMedia.message_file_id} onClick={() => {
                    setCurrMedia && setCurrMedia({
                        message_file_id: currMedia.message_file_id,
                        message_file_name: currMedia.message_file_name
                    })
                    setSlider && setSlider(true)
                }}></video>
            )
        } else if (isPicture.includes(ext)) {
            return (
                <img src={currMedia.message_file_name} alt="name" key={currMedia.message_file_id} onClick={() => {
                    setCurrMedia && setCurrMedia({
                        message_file_id: currMedia.message_file_id,
                        message_file_name: currMedia.message_file_name
                    })
                    setSlider && setSlider(true)
                }}/>
            )
        }
    }

    return (
        <div className={style.MediaBlock}>
            {getTag(media[0])}
            <span>
                {media && media.map((media, index) => index > 0 && getTag(media))}
            </span>
        </div>
    )
})

export default MediaBlock