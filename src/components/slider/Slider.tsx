import React, {useEffect, useRef, useState} from 'react'
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

interface ISlider {
    ref: React.RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: (state: boolean) => void,
    media: Array<string>,
    owner: string,
    date: Date
}

const Slider: React.FC<ISlider> = ({ref, state, setState, media, owner, date}) => {
    const [slide, setSlide] = useState(0)
    const [mediaArr, setMediaArr] = useState([...media])
    const [currMedia, setCurrMedia] = useState(media[0])
    const refSwipe = useRef<HTMLDivElement | null>(null)

    const swipeSlide = (side: boolean) => {
        setSlide(prev => {
            console.log(prev)
            const newSlide = side
                ? prev + (100 / mediaArr.length)
                : prev - (100 / mediaArr.length)

            if (newSlide >= 0 && newSlide < 100 && refSwipe.current) {
                refSwipe.current.style.left = `-${newSlide}%`
                return newSlide
            }

            return prev
        })
    }

    const deleteMedia = () => {

    }

    return (
        <CSSTransition
            in={state}
            nodeRef={ref}
            timeout={300}
            classNames='slider-node'
            unmountOnExit
        >
            <div className={style.SliderContainer} ref={ref}>
                <div onClick={event => event.stopPropagation()} className={style.ToolsBlock}>
                    <button>
                        <LoadImage chatImg='' chatTitle={owner}/>
                        <div>
                            <h4>{owner}</h4>
                            <p>{getDate(date)}</p>
                        </div>
                    </button>
                    <span>
                        <Button.WhiteButton>
                            <HiOutlineTrash/>
                        </Button.WhiteButton>
                        <Button.WhiteButton>
                            <HiOutlineShare/>
                        </Button.WhiteButton>
                        <Button.WhiteButton>
                            <HiOutlineDocumentArrowDown/>
                        </Button.WhiteButton>
                        <Button.WhiteButton>
                            <HiMagnifyingGlassPlus/>
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => setState(false)}>
                            <HiOutlineXMark/>
                        </Button.WhiteButton>
                    </span>
                </div>
                <div className={style.Slider} onClick={() => setState(false)}>
                    <div onClick={event => event.stopPropagation()}>
                        {slide > 0 && <Button.WhiteButton foo={() => swipeSlide(false)}>
                            <HiOutlineChevronLeft/>
                        </Button.WhiteButton>}
                        {slide <= 100 && <Button.WhiteButton foo={() => swipeSlide(true)}>
                            <HiOutlineChevronRight/>
                        </Button.WhiteButton>}
                    </div>
                    <div className={style.Swipe} ref={refSwipe}>
                        {
                            media.map(media => (
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