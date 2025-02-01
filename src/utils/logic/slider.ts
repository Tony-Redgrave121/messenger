import React, {useEffect, useState} from "react"

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
        currentSlide: { mediaId: '', mediaUrl: ''},
    })
    const [zoomState, setZoomState] = useState(false)
    const [zoomSize, setZoomSize] = useState(100)
    const refZoom = React.useRef<HTMLDivElement | null>(null)

    const handlePosition = (pos: number, lng: number, id: string) => {
        const curr = media.refSwipe.current

        if (curr) {
            refZoom.current = curr.querySelector(`[id="${id}"]`)
            if (media.refSwipe.current) media.refSwipe.current.style.left = `-${pos * (100 / lng)}%`
        }
    }

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

            setSlide(prevSlide => {
                console.log(prevSlide)
                const newSlide = Math.max(prevSlide.slideNumber - 1, 0)
                handlePosition(newSlide, newMediaArr.length, newMediaArr[newSlide].mediaId)

                return {
                    slideNumber: newSlide,
                    currentSlide: newMediaArr[newSlide]
                }
            })

            if (newMediaArr.length === 0) media.setAnimationState(false)

            return newMediaArr
        })
    }

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