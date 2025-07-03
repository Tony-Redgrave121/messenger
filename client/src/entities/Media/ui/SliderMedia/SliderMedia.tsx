import React, {FC} from "react";
import useLoadBlob from "@shared/lib/hooks/useLoadBlob/useLoadBlob";
import {getExt} from "@shared/lib";
import {Player} from "@features/Player";
import style from "../MessageMedia/style.module.css";
import {IMessageFile} from "@appTypes";
import {VIDEO_TYPES} from "../../consts/videoTypes";

interface ISliderProps {
    media: IMessageFile
}

const SliderMedia: FC<ISliderProps> = ({media}) => {
    const {load, image} = useLoadBlob(`messengers/${media.message_file_path}/${media.message_file_name}`)

    const handlePropagation = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    const geTag = () => {
        const ext = getExt(media.message_file_name)

        if (VIDEO_TYPES.includes(ext)) {
            return <Player
                key={media.message_file_id}
                id={media.message_file_id}
                src={image}
                foo={handlePropagation}
            />
        } else {
            return <img
                src={image}
                alt="media"
                key={media.message_file_id}
                id={media.message_file_id}
                draggable={'false'}
                onClick={handlePropagation}
            />
        }
    }

    return (
        <>
            {(load && image) ? geTag() : <div className={`${style.ShadowBlock} ${style.MinBlock}`}/>}
        </>
    )
}

export default SliderMedia