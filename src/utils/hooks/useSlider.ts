import React, {useCallback, useEffect, useState} from "react"
import * as events from "node:events";

interface IUseSliderProps {
    mediaArr: { mediaId: string, mediaUrl: string }[],
    setMediaArr: React.Dispatch<React.SetStateAction<{ mediaId: string, mediaUrl: string; }[] | undefined>>,
    setAnimationState: React.Dispatch<React.SetStateAction<boolean>>,
    currentSlide: { mediaId: string, mediaUrl: string },
    animationState: boolean,
    refSwipe: React.RefObject<HTMLDivElement | null>
}

const useSlider = (media: IUseSliderProps) => {
    const [slide, setSlide] = useState({
        slideNumber: 0,
        currentSlide: {mediaId: '', mediaUrl: ''},
    })
    const [zoomState, setZoomState] = useState(false)
    const [zoomSize, setZoomSize] = useState(100)
    const refZoom = React.useRef<HTMLImageElement | null>(null)

    const handlePosition = useCallback((pos: number, lng: number, id: string) => {
        const curr = media.refSwipe.current

        if (curr) {
            refZoom.current = curr.querySelector(`[id="${id}"]`)
            if (media.refSwipe.current) media.refSwipe.current.style.left = `-${pos * (100 / lng)}%`
        }
    }, [media.refSwipe])

    const swipeSlide = (side: boolean) => {
        setSlide(prev => {
            const newSlide = side ? prev.slideNumber + 1 : prev.slideNumber - 1
            if ((newSlide < 0 || newSlide >= media.mediaArr.length) && media.refSwipe.current) return prev

            handlePosition(newSlide, media.mediaArr.length, media.mediaArr[newSlide].mediaId)

            return {
                slideNumber: newSlide,
                currentSlide: media.mediaArr[newSlide]
            }
        })
    }

    const deleteMedia = () => {
        media.setMediaArr(prev => {
            if (!prev) return prev
            const newMediaArr = prev.filter(el => el.mediaId !== slide.currentSlide.mediaId)

            if (newMediaArr.length === 0) {
                media.setAnimationState(false)
                return newMediaArr
            }

            return newMediaArr
        })
    }

    useEffect(() => {
        if (media.mediaArr && media.mediaArr.length > 0) {
            const newSlide = Math.max(slide.slideNumber - 1, 0)
            handlePosition(newSlide, media.mediaArr.length, media.mediaArr[newSlide].mediaId)

            setSlide({
                slideNumber: newSlide,
                currentSlide: media.mediaArr[newSlide]
            })
        }
    }, [media.mediaArr])

    const downloadMedia = () => {
        const regex = new RegExp('\\/([^/.]+)\\.', 'i')
        const name = slide.currentSlide.mediaUrl.match(regex)
        const ext = slide.currentSlide.mediaUrl.split('.').pop()

        if (!name || !ext) return null

        const link = document.createElement('a')

        link.href = slide.currentSlide.mediaUrl
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

    useEffect(() => {
        setZoomState(false)

        setSlide(() => {
            let index = 0

            for (let i = 0; i < media.mediaArr.length; i++) {
                if (media.mediaArr[i].mediaId === media.currentSlide.mediaId) {
                    index = i
                    break
                }
            }

            handlePosition(index, media.mediaArr.length, media.currentSlide.mediaId)

            return {
                slideNumber: index,
                currentSlide: {
                    mediaId: media.currentSlide.mediaId,
                    mediaUrl: media.currentSlide.mediaUrl
                },
            }
        })
    }, [media.animationState])

    const draggableImage = (event: MouseEvent) => {
        if (!refZoom.current) return
        const img = refZoom.current
        const imgRect = img.getBoundingClientRect()
        const screenWidth = window.innerWidth, screenHeight = window.innerHeight
        const restWidth = imgRect.width - screenWidth, restHeight = imgRect.height - screenHeight

        let startX = event.clientX
        let startY = event.clientY
        let offsetX = imgRect.left
        let offsetY = imgRect.top

        const handlerDrag = (event: MouseEvent) => {
            const dx = event.clientX - startX, dy = event.clientY - startY
            const left = offsetX + dx, top = offsetY + dy
            const halfWidth = restWidth / 2, halfHeight = restHeight / 2

            if (restWidth >= 0 && left >= -halfWidth && left <= halfWidth) img.style.left = left + "px"
            if (restHeight >= 0 && top >= -halfHeight && top <= halfHeight) img.style.top = top + "px"
        }

        const stopDrag = () => {
            img.removeEventListener('mousemove', handlerDrag)
            img.removeEventListener('mouseup', stopDrag)
        }

        img.addEventListener('mousemove', handlerDrag)
        img.addEventListener('mouseup', stopDrag)

        return () => {
            refZoom.current!.addEventListener('mousemove', (event) => handlerDrag(event))
            refZoom.current!.addEventListener('mouseup', () => refZoom.current!.removeEventListener('mousemove', (event) => handlerDrag(event)))
        }
    }

    useEffect(() => {
        const img = refZoom.current
        if (!img) return

        const { width, height } = img.getBoundingClientRect()
        const clientWidth = window.innerWidth, clientHeight = window.innerHeight

        if (width > clientWidth || height > clientHeight)
            img.addEventListener('mousedown', draggableImage)
        else {
            img.style.left = '0'
            img.style.top = '0'
            img.removeEventListener('mousedown', draggableImage)
        }

        return () => img.removeEventListener('mousedown', draggableImage)
    }, [zoomSize])

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