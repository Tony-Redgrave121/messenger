import {RefObject, useCallback, useEffect} from "react";
import {IMessagesResponse} from "@appTypes";
import {useAppDispatch, useAppSelector} from "../../../rebuild/shared/lib";
import {setCurrentSlide, setSlideNumber} from "@store/reducers/sliderReducer";

const useSwipe = (
    message: IMessagesResponse,
    refSwipe: RefObject<HTMLDivElement | null>,
    refZoom: RefObject<HTMLImageElement | null>,
) => {
    const {state, currentSlide} = useAppSelector(state => state.slider)
    const dispatch = useAppDispatch()

    const handlePosition = useCallback((pos: number, lng: number, id: string) => {
        if (!refSwipe.current) return
        const curr = refSwipe.current

        setTimeout(() => {
            const element = curr.querySelector(`[id="${id}"]`) as HTMLImageElement
            if (element) refZoom.current = element
        }, 100)

        refSwipe.current.style.left = `-${pos * (100 / lng)}%`
    }, [refSwipe])

    useEffect(() => {
        if (!state) return

        const files = message?.message_files
        if (!files || files.length === 0) return

        const index = files.findIndex(item => item.message_file_id === currentSlide.message_file_id)
        handlePosition(index, files.length, currentSlide.message_file_id)


        dispatch(setSlideNumber(index))
        dispatch(setCurrentSlide(currentSlide))
    }, [state, message.message_files])

    return {
        handlePosition
    }
}

export default useSwipe