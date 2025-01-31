import React, {useRef, useState} from 'react'
import style from './style.module.css'
import {CSSTransition} from 'react-transition-group'
import './animation.css'
import LoadImage from "../loadImage/LoadImage";
import {getDate} from "../../utils/logic/getDate";
import Button from "../buttons/Buttons";
import {
    HiOutlineTrash,
    HiOutlineShare,
    HiOutlineDocumentArrowDown,
    HiMagnifyingGlassMinus,
    HiMagnifyingGlassPlus,
    HiOutlineXMark,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";
import useSlider from "../../utils/logic/slider";

interface ISlider {
    animation: {
        state: boolean,
        setState: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.RefObject<HTMLDivElement | null>
    },
    media: {
        mediaArr: string[],
        setMediaArr: React.Dispatch<React.SetStateAction<string[] | undefined>>,
        currentSlide: string
    },
    user: {
        owner: string,
        date: Date,
    }
}

const Slider: React.FC<ISlider> = ({animation, media, user}) => {
    const refSwipe = useRef<HTMLDivElement | null>(null)
    const [zoom, setZoom] = useState(0)

    const {downloadMedia, deleteMedia, swipeSlide, zoomMedia, shareMedia, slide} = useSlider({
        mediaArr: media.mediaArr,
        setMediaArr: media.setMediaArr,
        currentSlide: media.currentSlide,
        animationState: animation.state,
        setAnimationState: animation.setState,
        refSwipe,
    })

    return (
        <CSSTransition
            in={animation.state}
            nodeRef={animation.ref}
            timeout={300}
            classNames='slider-node'
            unmountOnExit
        >
            <div className={style.SliderContainer} ref={animation.ref}>
                <div onClick={event => event.stopPropagation()} className={style.ToolsBlock}>
                    <button>
                        <LoadImage chatImg='' chatTitle={user.owner}/>
                        <div>
                            <h4>{user.owner}</h4>
                            <p>{getDate(user.date)}</p>
                        </div>
                    </button>
                    <span>
                        <Button.WhiteButton foo={() => deleteMedia()}>
                            <HiOutlineTrash/>
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => shareMedia()}>
                            <HiOutlineShare/>
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => downloadMedia()}>
                            <HiOutlineDocumentArrowDown/>
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => zoomMedia()}>
                            <HiMagnifyingGlassPlus/>
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => animation.setState(false)}>
                            <HiOutlineXMark/>
                        </Button.WhiteButton>
                    </span>
                </div>
                {slide.slideNumber > 0 &&
                    <span className={style.LeftArrow}>
                        <Button.WhiteButton foo={() => swipeSlide(false)}>
                            <HiOutlineChevronLeft/>
                        </Button.WhiteButton>
                    </span>
                }
                {slide.slideNumber < media.mediaArr.length - 1 &&
                    <span className={style.RightArrow}>
                        <Button.WhiteButton foo={() => swipeSlide(true)}>
                            <HiOutlineChevronRight/>
                        </Button.WhiteButton>
                    </span>
                }
                <div className={style.Slider} onClick={() => animation.setState(false)}>
                    <div className={style.Swipe} ref={refSwipe}>
                        {
                            media.mediaArr.map(media => (
                                <div key={media} className={style.ImageBlock}>
                                    <img src={media} alt={media} onClick={(event) => event.stopPropagation()}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Slider