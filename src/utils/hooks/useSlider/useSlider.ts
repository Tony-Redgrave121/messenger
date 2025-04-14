import {useEffect, useState} from "react"
import useZoom from "./useZoom"
import {IUseSliderProps} from "@appTypes";
import useSwipe from "@utils/hooks/useSlider/useSwipe";

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
        const regex = new RegExp('\\/([^/.]+)\\.', 'i')
        const name = slide.currentSlide.message_file_name.match(regex)
        const ext = slide.currentSlide.message_file_name.split('.').pop()

        if (!name || !ext) return null

        const link = document.createElement('a')

        link.href = slide.currentSlide.message_file_name
        link.download = `${name[1]}.${ext}`
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