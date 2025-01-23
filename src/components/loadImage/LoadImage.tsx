import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'

interface ILoadImage {
    chatImg: string,
    chatTitle: string,
}

const LoadImage: React.FC<ILoadImage> = ({chatImg, chatTitle}) => {
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')
    const refImageContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (image) {
            fetch(`https://image/${chatImg}`)
                .then(data => data.blob())
                .then(image => {
                    setImage(URL.createObjectURL(image))
                    setLoad(true)
                    return true
                })
                .catch(error => console.log(error))
        } else setLoad(true)
    }, [image, chatImg])

    const createImage = (title: string) => {
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
            {load && image ? <img src={image} alt={chatTitle}/> : <h1>{createImage(chatTitle)}</h1>}
        </div>
    )
}

export default LoadImage