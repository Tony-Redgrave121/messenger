import React, {memo} from 'react'
import style from "./style.module.css"
import MediaTag from "../mediaTag/MediaTag"
import IFileObject from "../../../types/IFileObject";
import IMessageFile from "../../../types/IMessageFile";

interface IMedia {
    media: IFileObject[]
}

interface IMediaBlock {
    media: IMessageFile[],
    setSlider?: (state: boolean) => void,
    setCurrMedia?: React.Dispatch<React.SetStateAction<IMessageFile>>,
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
                <MediaTag.InputBlock media={media[0]} key={media[0].url}/>
                <span>
                    {media.slice(1).map(media => <MediaTag.InputBlock media={media} key={media.url}/>)}
                </span>
            </div>
        )
    })
}



export default MediaBlock