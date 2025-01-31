import React, {useEffect, useState} from "react"

interface IUseSliderProps {
    mediaArr: Array<string>,
    setMediaArr: React.Dispatch<React.SetStateAction<Array<string> | undefined>>,
    setAnimationState: React.Dispatch<React.SetStateAction<boolean>>,
    currentSlide: string,
    animationState: boolean,
    refSwipe: React.RefObject<HTMLDivElement | null>
}

const useSlider = (media: IUseSliderProps) => {
    const [slide, setSlide] = useState({
        slideNumber: 0,
        currentSlide: media.mediaArr[0] || '',
    })

    const handlePosition = (pos: number, lng: number) => {
        if (media.refSwipe.current) media.refSwipe.current.style.left = `-${pos * (100 / lng)}%`
    }

    const swipeSlide = (side: boolean) => {
        setSlide(prev => {
            const newSlide = side ? prev.slideNumber + 1 : prev.slideNumber - 1
            if ((newSlide < 0 || newSlide >= media.mediaArr.length) && media.refSwipe.current) return prev

            handlePosition(newSlide, media.mediaArr.length)

            return {
                slideNumber: newSlide,
                currentSlide: media.mediaArr[newSlide]
            }
        })
    }

    const deleteMedia = () => {
        media.setMediaArr(prev => {
            if (!prev) return prev
            const newMediaArr = prev.filter(el => el !== slide.currentSlide)

            setSlide(prevSlide => {
                const newSlide = Math.max(prevSlide.slideNumber - 1, 0)
                handlePosition(newSlide, newMediaArr.length)

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
        const name = slide.currentSlide.match(regex)
        const ext = slide.currentSlide.split('.').pop()

        if (!name || !ext) return null

        const link = document.createElement('a')

        link.href = slide.currentSlide
        link.download = `${name[1]}.${ext}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const zoomMedia = () => {

    }

    const shareMedia = () => {

    }

    useEffect(() => {
        setSlide(() => {
            const index = media.mediaArr.indexOf(media.currentSlide)
            handlePosition(index, media.mediaArr.length)

            return {
                slideNumber: index,
                currentSlide: media.currentSlide,
            }
        })
    }, [media.animationState])

    return {
        swipeSlide,
        deleteMedia,
        downloadMedia,
        zoomMedia,
        shareMedia,
        slide
    }
}

export default useSlider