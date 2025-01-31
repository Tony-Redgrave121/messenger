import React, {memo} from 'react'
import style from "./style.module.css"

interface IMediaBlock {
    media: Array<string>,
    setSlider: (state: boolean) => void,
    setCurrMedia: (state: string) => void,
}

const MediaBlock: React.FC<IMediaBlock> = memo(({media, setSlider, setCurrMedia}) => {
    const getTag = (name: string) => {
        const isPicture = ['png', 'jpg', 'jpeg', 'webp']
        const isVideo = ['mp4', 'webm']

        const type = name!.split('.')
        const ext = type[type.length - 1]

        if (isVideo.includes(ext)) {
            return (
                <video src={name} key={name} onClick={() => {
                    setCurrMedia(name)
                    setSlider(true)
                }}></video>
            )
        } else if (isPicture.includes(ext)) {
            return (
                <img src={name} alt="name" key={name} onClick={() => {
                    setCurrMedia(name)
                    setSlider(true)
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