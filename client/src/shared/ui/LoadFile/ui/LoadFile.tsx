import {FC, useRef} from 'react'
import style from './style.module.css'
import useLoadBlob from "../../../lib/hooks/useLoadBlob/useLoadBlob"
import {getTitle} from "../../../lib";

interface ILoadImage {
    imagePath?: string,
    imageTitle: string,
}

const LoadFile: FC<ILoadImage> = ({imagePath, imageTitle}) => {
    const refImageContainer = useRef<HTMLDivElement>(null)
    const {load, image} = useLoadBlob(imagePath)

    return (
        <div className={style.ImageContainer} ref={refImageContainer}>
            {load && image ? <img src={image} alt={imageTitle}/> : <h1>{getTitle(refImageContainer, imageTitle, 'backgroundColor')}</h1>}
        </div>
    )
}

export default LoadFile