import {Dispatch, RefObject, SetStateAction, useCallback, useEffect} from "react";
import {IUseSliderProps, ISlide} from "@appTypes";

const useSwipe = (media: IUseSliderProps, refZoom: RefObject<HTMLImageElement | null>, slide: ISlide, setSlide: Dispatch<SetStateAction<ISlide>>) => {
    const handlePosition = useCallback((pos: number, lng: number, id: string) => {
        if (!media.refSwipe.current) return
        const curr = media.refSwipe.current

        setTimeout(() => {
            const element = curr.querySelector(`[id="${id}"]`) as HTMLImageElement
            if (element) refZoom.current = element
        }, 100)

        media.refSwipe.current.style.left = `-${pos * (100 / lng)}%`
    }, [media.refSwipe])

    useEffect(() => {
        if (media.mediaArr && media.mediaArr.length > 0) {
            const newSlide = Math.max(slide.slideNumber - 1, 0)
            handlePosition(newSlide, media.mediaArr.length, media.mediaArr[newSlide].message_file_id)

            setSlide({
                slideNumber: newSlide,
                currentSlide: media.mediaArr[newSlide]
            })
        }
    }, [media.mediaArr])

    useEffect(() => {
        if (media.animationState) {
            setSlide(() => {
                const index = media.mediaArr.findIndex(item => item.message_file_id === media.currentSlide.message_file_id)

                handlePosition(index, media.mediaArr.length, media.currentSlide.message_file_id)

                return {
                    slideNumber: index,
                    currentSlide: media.currentSlide
                }
            })
        }
    }, [media.animationState])

    return {
        handlePosition
    }
}

export default useSwipe