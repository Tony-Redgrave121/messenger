import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import style from './style.module.css'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setCurrVideo} from "@store/reducers/sliderReducer"
import Buttons from "../buttons/Buttons";
import Inputs from "../inputs/Inputs";
import {HiArrowsPointingIn, HiArrowsPointingOut, HiMiniPause, HiPlay} from "react-icons/hi2";
import {getVideoTime} from "@utils/logic/getDate";

interface IPlayerProps {
    src: string,
    id: string,
    foo?: (event: React.MouseEvent<HTMLElement>) => void
}

const Player: FC<IPlayerProps> = ({src, id, foo}) => {
    const [pause, setPause] = useState(true)
    const [fullScreen, setFullScreen] = useState(true)
    const [time, setTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const playerRef = useRef<HTMLElement | null>(null)
    const {currVideo, zoom} = useAppSelector(state => state.slider)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (currVideo !== id) setPause(true)
    }, [currVideo, id])

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

    const handleFullscreen = () => {
        const curr = playerRef.current
        if (!curr) return

        if (!document.fullscreenElement) curr.requestFullscreen()
        else document.exitFullscreen()
    }

    useEffect(() => {
        const curr = playerRef.current
        if (!curr) return

        const handleFullscreen = () => setFullScreen(prev => !prev)

        curr.addEventListener('fullscreenchange', handleFullscreen)
        return () => curr.removeEventListener('fullscreenchange', handleFullscreen)
    }, [])

    useEffect(() => {
        const curr = videoRef.current
        if (!curr) return

        curr.onloadedmetadata = () => {
            const currDuration = curr.duration
            setDuration(currDuration)
        }
    }, [videoRef])

    useEffect(() => {
        const curr = videoRef.current
        if (!curr) return

        const updateTime = () => {
            setTime(curr.currentTime)
        }

        const repeatVideo = () => {
            setTime(0)
            curr.play()
        }

        curr.addEventListener('timeupdate', updateTime)
        curr.addEventListener('ended', repeatVideo)

        return () => {
            curr.removeEventListener('timeupdate', updateTime)
            curr.removeEventListener('ended', repeatVideo)
        }
    }, [])

    const formattedTime = useMemo(() => getVideoTime(time), [time])
    const getDuration = useMemo(() => getVideoTime(duration), [duration])

    return (
        <section className={style.VideoPlayer} onClick={event => foo && foo(event)} ref={playerRef}>
            <video src={src} id={id} ref={videoRef}/>
            {!zoom &&
                <>
                    <Buttons.PlayerButton foo={handlePlay} className='PlayButton'>
                        {pause && <HiPlay/>}
                    </Buttons.PlayerButton>
                    <div className={style.BottomBar}>
                        <Inputs.TimeInput mediaRef={videoRef} time={time} setTime={setTime} duration={duration}/>
                        <div className={style.ControlBar}>
                            <div>
                                <Buttons.PlayerButton foo={handlePlay} className='PlayButtonMini'>
                                    {pause ? <HiPlay/> : <HiMiniPause/>}
                                </Buttons.PlayerButton>
                                <Inputs.VolumeInput mediaRef={videoRef}/>
                                <span className={style.TimeBlock}>
                                    <time>{(time && duration) ? formattedTime : '0:00'}</time>
                                    <p>/</p>
                                    <time>{duration ? getDuration : '0:00'}</time>
                                </span>
                            </div>
                            <div>
                                <Buttons.PlayerButton className='PlayButtonMini' foo={handleFullscreen}>
                                    {fullScreen ? <HiArrowsPointingOut/> : <HiArrowsPointingIn/>}
                                </Buttons.PlayerButton>
                            </div>
                        </div>
                    </div>
                </>
            }
        </section>
    )
}

export default Player