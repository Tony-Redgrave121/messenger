import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import style from './style.module.css'
import {useAppDispatch, useAppSelector, getVideoTime} from "@shared/lib";
import {setCurrVideo} from "@entities/Media/model/slice/videoSlice"
import {HiArrowsPointingIn, HiArrowsPointingOut, HiMiniPause, HiPlay} from "react-icons/hi2";
import {TimeInput} from "@shared/ui/Input";
import {PlayButton} from "@shared/ui/Button";
import {VolumeInput} from "@entities/Media";

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

    const currVideo = useAppSelector(state => state.video.currVideo)
    const zoom = useAppSelector(state => state.slider.zoom)
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
                    <PlayButton foo={handlePlay}>
                        {pause && <HiPlay/>}
                    </PlayButton>
                    <div className={style.BottomBar}>
                        <TimeInput mediaRef={videoRef} time={time} setTime={setTime} duration={duration}/>
                        <div className={style.ControlBar}>
                            <div>
                                <PlayButton foo={handlePlay} isMini>
                                    {pause ? <HiPlay/> : <HiMiniPause/>}
                                </PlayButton>
                                <VolumeInput mediaRef={videoRef}/>
                                <span className={style.TimeBlock}>
                                    <time>{(time && duration) ? formattedTime : '0:00'}</time>
                                    <p>/</p>
                                    <time>{duration ? getDuration : '0:00'}</time>
                                </span>
                            </div>
                            <div>
                                <PlayButton foo={handleFullscreen}>
                                    {fullScreen ? <HiArrowsPointingOut/> : <HiArrowsPointingIn/>}
                                </PlayButton>
                            </div>
                        </div>
                    </div>
                </>
            }
        </section>
    )
}

export default Player