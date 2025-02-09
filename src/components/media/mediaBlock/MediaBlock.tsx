import React, {memo} from 'react'
import style from "./style.module.css"
import MediaTag from "../mediaTag/MediaTag";

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
    return (
        <div className={style.MediaBlock}>
            <MediaTag media={media[0]} setSlider={setSlider} setCurrMedia={setCurrMedia} key={media[0].message_file_id}/>
            <span>
                {media.slice(1).map(media => <MediaTag media={media} setSlider={setSlider} setCurrMedia={setCurrMedia} key={media.message_file_id}/>)}
            </span>
        </div>
    )
})

export default MediaBlock