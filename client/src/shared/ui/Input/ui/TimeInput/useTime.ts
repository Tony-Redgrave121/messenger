import {
    ChangeEvent,
    Dispatch,
    RefObject,
    SetStateAction,
    useEffect,
    useRef
} from "react";
import {rangeProgress} from "../../../../lib";

const useVolume = (
    mediaRef: RefObject<HTMLVideoElement | null>,
    time: number,
    setTime: Dispatch<SetStateAction<number>>,
    duration: number
) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const changeMediaTime = (event: ChangeEvent<HTMLInputElement>) => {
        if (!mediaRef || ! mediaRef.current) return
        const newTime = Number.parseFloat(event.target.value)

        setTime(newTime)
        mediaRef.current.currentTime = newTime
    }

    useEffect(() => {
        rangeProgress(time * 100 / duration, inputRef)
    }, [duration, time])

    return {
        changeMediaTime,
        inputRef
    }
}

export default useVolume