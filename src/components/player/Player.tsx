import React, {FC} from 'react'
import style from './style.module.css'
import { HiPlay } from "react-icons/hi2";

interface IPlayerProps {
    src: string,
    id: string
}

const Player: FC<IPlayerProps> = ({src, id}) => {
    const handlePlay = () => {

    }

    return (
        <section className={style.VideoPlayer}>
            <video src={src} id={id}/>
            <button onClick={handlePlay} className={style.PlayButton}>
                <HiPlay/>
            </button>
        </section>
    )
}

export default Player