import {useEffect, useState} from "react"
import useZoom from "./useZoom"
import {IUseSliderProps} from "@appTypes";
import useSwipe from "@utils/hooks/useSlider/useSwipe";
import getExt from "@utils/logic/getExt";
import useLoadBlob from "@hooks/useLoadBlob";
import {useParams} from "react-router-dom";

const initialCurrMedia = {
    message_file_id: '',
    message_file_name: '',
    message_file_size: 0
}

const useSlider = (media: IUseSliderProps) => {
    const [slide, setSlide] = useState({
        slideNumber: 0,
        currentSlide: initialCurrMedia,
    })
    const [zoomState, setZoomState] = useState(false)
    const {setZoomSize, zoomSize, refZoom} = useZoom()
    const {handlePosition} = useSwipe(media, refZoom, slide, setSlide)
    const {id} = useParams()

    // let {load, image} = useLoadBlob(`messengers/${id}/${slide.currentSlide.message_file_name}`)

    useEffect(() => {
        setZoomState(false)
    }, [media.animationState])

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
        const name = slide.currentSlide.message_file_name
        const ext = getExt(slide.currentSlide.message_file_name)

        if (!name || !ext) return null
        const link = document.createElement('a')

        // link.href = image
        link.download = `${name}.${ext}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const zoomMedia = (value: string) => {
        if (refZoom.current) {
            setZoomSize(Number(value))
            refZoom.current.style.transform = `scale(${value}%)`
            if (refZoom.current.style.transform === 'scale(1)') setZoomState(false)
        }
    }

    const shareMedia = () => {

    }

    return {
        swipeSlide,
        deleteMedia,
        downloadMedia,
        zoomMedia,
        zoomState,
        setZoomState,
        shareMedia,
        slide,
        zoomSize
    }
}

export default useSlider