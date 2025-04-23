import React, {ChangeEvent, Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import Buttons from "@components/buttons/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setVolume} from "@store/reducers/sliderReducer"
import {handleRangeProgress} from "@utils/logic/handleRangeProgress";
import {getStyles} from "@utils/logic/getStyles";
import {CSSTransition} from "react-transition-group";
import './animation.css'

interface IRangeInput {
    min: string | number,
    max: string | number,
    value: string | number,
    foo: (value: number) => void,
    classNames: string[],
}

interface IMediaInput {
    mediaRef: RefObject<HTMLVideoElement | null>
}

interface IMediaTimeInput extends IMediaInput {
    time: number,
    setTime: Dispatch<SetStateAction<number>>,
    duration: number
}

namespace Inputs {
    export const RangeInput: FC<IRangeInput> = ({min, max, value, foo, classNames}) => {
        const inputRef = useRef<HTMLInputElement>(null)

        const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
            const volume = Number.parseFloat(event.target.value)

            handleRangeProgress(volume, inputRef)
            foo(volume)
        }

        return (
            <input type="range" min={min} max={max} value={value} onChange={handleOnChange} className={getStyles(classNames, style)} ref={inputRef}/>
        )
    }
    export const TimeInput: FC<IMediaTimeInput> = ({mediaRef, time, setTime, duration}) => {
        const inputRef = useRef<HTMLInputElement>(null)

        const changeMediaTime = (event: ChangeEvent<HTMLInputElement>) => {
            if (!mediaRef || ! mediaRef.current) return
            const newTime = Number.parseFloat(event.target.value)

            setTime(newTime)
            mediaRef.current.currentTime = newTime
        }

        useEffect(() => {
            handleRangeProgress(time * 100 / duration, inputRef)
        }, [duration, time])

        return (
            <input min={0} max={duration} value={time} type="range" onChange={changeMediaTime} className={style.WideInput} ref={inputRef}/>
        )
    }
    export const VolumeInput: FC<IMediaInput> = ({mediaRef}) => {
        const volume = useAppSelector(state => state.slider.volume)
        const dispatch = useAppDispatch()
        const inputRef = useRef<HTMLInputElement>(null)
        const [isEnter, setIsEnter] = useState(false)

        const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
            const value = Number.parseFloat(event.target.value)

            dispatch(setVolume(value))
        }

        const handleVolume = () => {
            const value = !volume ? 100 : 0

            dispatch(setVolume(value))
        }

        useEffect(() => {
            const changeMediaVolume = (value: number) => {
                if (!mediaRef || ! mediaRef.current) return

                mediaRef.current.volume = value / 100
            }
            
            changeMediaVolume(volume)
        }, [mediaRef, volume])

        useEffect(() => {
            handleRangeProgress(volume, inputRef)
        }, [volume, isEnter])

        return (
            <span className={style.VolumeBlock} onMouseEnter={() => setIsEnter(true)} onMouseLeave={() => setIsEnter(false)}>
                <Buttons.VolumeButton handleVolume={handleVolume}/>
                <CSSTransition
                    timeout={300}
                    classNames='volume-input-node'
                    nodeRef={inputRef}
                    in={isEnter}
                    unmountOnExit
                >
                    <input min={0} max={100} type="range" onChange={handleOnChange} value={volume} className={style.WideInput} ref={inputRef}/>
                </CSSTransition>
            </span>
        )
    }
}

export default Inputs