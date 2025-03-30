import React from 'react'
import style from "./style.module.css"
import LoadFile from "../../loadFile/LoadFile"

interface IImageBlockProps {
    image: string,
    info: {
        name: string,
        type: string
    }
}

const ImageBlock: React.FC<IImageBlockProps> = ({image, info}) => {
    return (
        <>
            {image ?
                <div className={style.ImageBlock} style={{backgroundImage: `url('${image}')`}}>
                    <div className={style.TitleBlock}>
                        <h1>{info.name}</h1>
                        <p>{info.type}</p>
                    </div>
                </div>
                :
                <div className={style.ImageBlock}>
                    <LoadFile imagePath={''} imageTitle={info.name}/>
                    <div className={style.TitleBlock}>
                        <h1>{info.name}</h1>
                        <p>{info.type}</p>
                    </div>
                </div>
            }
        </>
    )
}

export default ImageBlock