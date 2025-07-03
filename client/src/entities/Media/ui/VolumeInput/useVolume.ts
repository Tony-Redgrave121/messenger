import {ChangeEvent, RefObject, useEffect, useRef, useState} from "react";
import {rangeProgress} from "@shared/lib";
import {useAppDispatch, useAppSelector} from "@shared/lib";
import {setVolume} from "../../model/slice/videoSlice";

const useVolume = (mediaRef: RefObject<HTMLVideoElement | null>) => {
    const volume = useAppSelector(state => state.video.volume)
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
        rangeProgress(volume, inputRef)
    }, [volume, isEnter])

    return {
        isEnter,
        setIsEnter,
        handleVolume,
        handleOnChange,
        inputRef,
        volume
    }
}

export default useVolume