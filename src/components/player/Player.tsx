import React, {FC, useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setCurrVideo} from "@store/reducers/sliderReducer"
import Buttons from "../buttons/Buttons";
import Inputs from "../inputs/Inputs";
import {HiArrowsPointingOut, HiMiniPause, HiPlay} from "react-icons/hi2";

interface IPlayerProps {
    src: string,
    id: string,
    foo?: (event: React.MouseEvent<HTMLElement>) => void
}

const Player: FC<IPlayerProps> = ({src, id, foo}) => {
    const [pause, setPause] = useState(true)
    const [time, setTime] = useState('0')
    const videoRef = useRef<HTMLVideoElement | null>(null)
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

    return (
        <section className={style.VideoPlayer} onClick={event => foo && foo(event)}>
            <video src={src} id={id} ref={videoRef}/>
            {!zoom &&
                <>
                    <Buttons.PlayerButton foo={handlePlay} className='PlayButton'>
                        {pause && <HiPlay/>}
                    </Buttons.PlayerButton>
                    <div className={style.BottomBar}>
                        <Inputs.RangeInput min={0} max={100} value={time} foo={setTime} className='WideInput'/>
                        <div className={style.ControlBar}>
                            <div>
                                <Buttons.PlayerButton foo={handlePlay} className='PlayButtonMini'>
                                    {pause ? <HiPlay/> : <HiMiniPause/>}
                                </Buttons.PlayerButton>
                                <Inputs.VolumeInput/>
                                <span className={style.TimeBlock}>
                                    <time>0:00</time>
                                    <p>/</p>
                                    <time>0:18</time>
                                </span>
                            </div>
                            <div>
                                <Buttons.PlayerButton className='PlayButtonMini'>
                                    <HiArrowsPointingOut/>
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