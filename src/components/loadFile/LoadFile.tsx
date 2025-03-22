import React, {useRef} from 'react'
import style from './style.module.css'
import useLoadFile from "../../utils/hooks/useLoadFile"

interface ILoadImage {
    imagePath?: string,
    imageTitle: string,
}

const LoadFile: React.FC<ILoadImage> = ({imagePath, imageTitle}) => {
    const refImageContainer = useRef<HTMLDivElement>(null)
    const {load, image} = useLoadFile(imagePath)

    const createImage = (title: string) => {
        if (!title) return null

        const words = title.split(' ')
        const n = words.length
        const charF = words[0][0], charL = words[n - 1][0]

        if (refImageContainer.current)
            refImageContainer.current.style.backgroundColor = `rgb(225, 
                ${charF.charCodeAt(0).toString().slice(0, 2)}, 
                ${charL.charCodeAt(0).toString().slice(0, 2)}
            )`

        return n > 1 ? charF + charL : charF
    }

    return (
        <div className={style.ImageContainer} ref={refImageContainer}>
            {load && image ? <img src={image} alt={imageTitle}/> : <h1>{createImage(imageTitle)}</h1>}
        </div>
    )
}

export default LoadFile