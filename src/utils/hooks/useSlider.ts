import React, {useCallback, useEffect, useState} from "react"

interface IUseSliderProps {
    mediaArr: { message_file_id: string, message_file_name: string}[],
    setMediaArr: React.Dispatch<React.SetStateAction<{ message_file_id: string, message_file_name: string; }[] | undefined>>,
    setAnimationState: React.Dispatch<React.SetStateAction<boolean>>,
    currentSlide: { message_file_id: string, message_file_name: string },
    animationState: boolean,
    refSwipe: React.RefObject<HTMLDivElement | null>
}

const useSlider = (media: IUseSliderProps) => {
    const [slide, setSlide] = useState({
        slideNumber: 0,
        currentSlide: {message_file_id: '', message_file_name: ''},
    })
    const [zoomState, setZoomState] = useState(false)
    const [zoomSize, setZoomSize] = useState(100)
    const refZoom = React.useRef<HTMLImageElement | null>(null)

    const handlePosition = useCallback((pos: number, lng: number, id: string) => {
        if (!media.refSwipe.current) return
        const curr = media.refSwipe.current

        const observer = new MutationObserver(() => {
            const element = curr.querySelector(`[id="${id}"]`) as HTMLImageElement
            if (element) refZoom.current = element
        })

        media.refSwipe.current!.style.left = `-${pos * (100 / lng)}%`
        observer.observe(curr, { childList: true, subtree: true })
    }, [media.refSwipe])

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
        console.log(refZoom.current)
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
                if (media.mediaArr[i].message_file_id === media.currentSlide.message_file_id) {
                    index = i
                    break
                }
            }

            handlePosition(index, media.mediaArr.length, media.currentSlide.message_file_id)

            return {
                slideNumber: index,
                currentSlide: {
                    message_file_id: media.currentSlide.message_file_id,
                    message_file_name: media.currentSlide.message_file_name
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