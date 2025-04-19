import React, {FC, useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setCurrVideo} from "@store/reducers/appReducer"
import Buttons from "../buttons/Buttons";

interface IPlayerProps {
    src: string,
    id: string,
    foo?: (event: React.MouseEvent<HTMLElement>) => void
}

const Player: FC<IPlayerProps> = ({src, id, foo}) => {
    const [pause, setPause] = useState(true)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const currVideo = useAppSelector(state => state.app.currVideo)
    const dispatch = useAppDispatch()

    useEffect(() => {
        setPause(true)
    }, [currVideo])

    const handlePlay = () => {
        if (!videoRef || !videoRef.current) return
        if (videoRef.current.paused) {
            videoRef.current.play()
            setPause(false)

            if (currVideo !== id) dispatch(setCurrVideo(id))
        } else {
            videoRef.current.pause()
            setPause(true)
        }
    }

    return (
        <section className={style.VideoPlayer} onClick={event => foo && foo(event)}>
            <video src={src} id={id} ref={videoRef}/>
            <Buttons.PlayButton handlePlay={handlePlay} pause={pause}/>
        </section>
    )
}

export default Player