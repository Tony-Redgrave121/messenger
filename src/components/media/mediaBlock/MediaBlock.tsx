import React, {memo} from 'react'
import style from "./style.module.css"

interface IMediaBlock {
    media: Array<{
        mediaId: string,
        mediaUrl: string
    }>,
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<{
        mediaId: string,
        mediaUrl: string
    }>>,
}

const MediaBlock: React.FC<IMediaBlock> = memo(({media, setSlider, setCurrMedia}) => {
    const getTag = (currMedia: { mediaId: string, mediaUrl: string }) => {
        const isPicture = ['png', 'jpg', 'jpeg', 'webp']
        const isVideo = ['mp4', 'webm']

        const type = currMedia.mediaId!.split('.')
        const ext = type[type.length - 1]

        if (isVideo.includes(ext)) {
            return (
                <video src={currMedia.mediaUrl} key={currMedia.mediaId} onClick={() => {
                    setCurrMedia && setCurrMedia({
                        mediaId: currMedia.mediaId,
                        mediaUrl: currMedia.mediaUrl
                    })
                    setSlider && setSlider(true)
                }}></video>
            )
        } else if (isPicture.includes(ext)) {
            return (
                <img src={currMedia.mediaUrl} alt="name" key={currMedia.mediaId} onClick={() => {
                    setCurrMedia && setCurrMedia({
                        mediaId: currMedia.mediaId,
                        mediaUrl: currMedia.mediaUrl
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