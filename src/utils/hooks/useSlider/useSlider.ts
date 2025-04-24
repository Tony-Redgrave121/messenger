import {useEffect, useState} from "react"
import useZoom from "./useZoom"
import {IUseSliderProps} from "@appTypes";
import useSwipe from "@utils/hooks/useSlider/useSwipe";
import getExt from "@utils/logic/getExt";
import useLoadBlob from "@hooks/useLoadBlob";
import {useParams} from "react-router-dom";
import {useAppDispatch} from "@hooks/useRedux";
import {setZoom} from "@store/reducers/sliderReducer";
import getFileName from "@utils/logic/getFileName";

const initialCurrMedia = {
    message_file_id: '',
    message_file_name: '',
    message_file_size: 0
}

const useSlider = (media: IUseSliderProps) => {
    const dispatch = useAppDispatch()
    const [slide, setSlide] = useState({
        slideNumber: 0,
        currentSlide: initialCurrMedia,
    })
    const {setZoomSize, zoomSize, refZoom} = useZoom()
    const {handlePosition} = useSwipe(media, refZoom, slide, setSlide)
    const {id} = useParams()

    let {load, image} = useLoadBlob(`messengers/${id}/${slide.currentSlide.message_file_name}`)

    useEffect(() => {
        dispatch(setZoom(false))
    }, [dispatch, media.animationState])

    const swipeSlide = (side: boolean) => {
        setSlide(prev => {
            const newSlide = side ? prev.slideNumber + 1 : prev.slideNumber - 1
            if ((newSlide < 0 || newSlide >= media.mediaArr.length) && media.refSwipe.current) return prev

            handlePosition(newSlide, media.mediaArr.length, media.mediaArr[newSlide].message_file_id)

            return {
                slideNumber: newSlide,
                currentSlide: media.mediaArr[newSlide]
            }
        })
    }

    const deleteMedia = () => {
        media.setMediaArr(prev => {
            if (!prev) return prev
            const newMediaArr = prev.filter(el => el.message_file_id !== slide.currentSlide.message_file_id)

            if (newMediaArr.length === 0) {
                media.setAnimationState(false)
                return newMediaArr
            }

            return newMediaArr
        })
    }

    const downloadMedia = () => {
        const name = getFileName(slide.currentSlide.message_file_name)
        const ext = getExt(slide.currentSlide.message_file_name)

        if (!name || !ext || !load) return
        const link = document.createElement('a')

        link.href = image
        link.download = name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const zoomMedia = (value: number) => {
        if (refZoom.current) {
            setZoomSize(Number(value))
            refZoom.current.style.transform = `scale(${value}%)`
            if (refZoom.current.style.transform === 'scale(1)') dispatch(setZoom(false))
        }
    }

    const shareMedia = () => {

    }

    return {
        swipeSlide,
        deleteMedia,
        downloadMedia,
        zoomMedia,
        shareMedia,
        slide,
        zoomSize
    }
}

export default useSlider