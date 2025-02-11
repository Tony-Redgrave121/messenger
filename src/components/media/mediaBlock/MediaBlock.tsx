import React, {memo} from 'react'
import style from "./style.module.css"
import MediaTag from "../mediaTag/MediaTag"

interface IMedia {
    media: Array<{
        message_file_id: string,
        message_file_name: string
    }>
}

interface IMediaBlock extends IMedia {
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<{
        message_file_id: string,
        message_file_name: string
    }>>,
}

namespace MediaBlock {
    export const Slider: React.FC<IMediaBlock> = memo(({media, setSlider, setCurrMedia}) => {
        return (
            <div className={style.MediaBlock}>
                <MediaTag.Slider media={media[0]} setSlider={setSlider} setCurrMedia={setCurrMedia} key={media[0].message_file_id}/>
                <span>
                    {media.slice(1).map(media => <MediaTag.Slider media={media} setSlider={setSlider} setCurrMedia={setCurrMedia} key={media.message_file_id}/>)}
                </span>
            </div>
        )
    })

    export const InputBlock: React.FC<IMedia> = memo(({media}) => {
        return (
            <div className={style.MediaBlock}>
                <MediaTag.InputBlock media={media[0]} key={media[0].message_file_id}/>
                <span>
                    {media.slice(1).map(media => <MediaTag.InputBlock media={media} key={media.message_file_id}/>)}
                </span>
            </div>
        )
    })
}



export default MediaBlock