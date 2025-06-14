import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import style from './style.module.css'
import {CSSTransition} from 'react-transition-group'
import './animation.css'
import {LoadFile} from "@components/loadFile/";
import {getDate} from "@utils/logic/getDate";
import {Buttons} from "@components/buttons";
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
import useSlider from "@utils/hooks/useSlider/useSlider";
import {MediaTag} from "@components/media";
import {IAnimationState, IMessageFile} from "@appTypes";
import useAnimation from "@hooks/useAnimation";
import Inputs from "@components/inputs/Inputs";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setZoom} from "@store/reducers/sliderReducer";
import {Link} from "react-router-dom";

interface ISlider {
    animation: {
        state: boolean,
        setState: Dispatch<SetStateAction<IAnimationState>>,
        ref: RefObject<HTMLDivElement | null>
    },
    media: {
        mediaArr: IMessageFile[],
        setMediaArr: Dispatch<SetStateAction<IMessageFile[]>>,
        currentSlide: IMessageFile
    },
    user: {
        owner_id: string,
        owner_image: string,
        owner_name: string,
        message_date: Date,
    }
}

const Slider: FC<ISlider> = ({animation, media, user}) => {
    const refSwipe = useRef<HTMLDivElement | null>(null)
    const [animationState, setAnimationState] = useState(false)
    const dispatch = useAppDispatch()
    const zoom = useAppSelector(state => state.slider.zoom)

    const {
        downloadMedia,
        deleteMedia,
        swipeSlide,
        zoomMedia,
        shareMedia,
        slide,
        zoomSize
    } = useSlider({
        mediaArr: media.mediaArr,
        setMediaArr: media.setMediaArr,
        currentSlide: media.currentSlide,
        setAnimationState: setAnimationState,
        animationState: animationState,
        refSwipe,
    })

    useAnimation(animation.state, setAnimationState, animation.setState)

    const handleZoom = (side: boolean) => {
        const newZoom = side ? zoomSize - 20 : zoomSize + 20

        if (newZoom >= 100 && newZoom <= 200) zoomMedia(newZoom)
        else side ? zoomMedia(100) : zoomMedia(200)
    }

    return (
        <CSSTransition
            in={animationState}
            nodeRef={animation.ref}
            timeout={300}
            classNames='slider-node'
            unmountOnExit
        >
            <div className={style.SliderContainer} ref={animation.ref}>
                <div onClick={event => event.stopPropagation()} className={style.ToolsBlock}>
                    <Link to={`/chat/${user.owner_id}`}>
                        <LoadFile imagePath={user.owner_image ? `users/${user.owner_id}/${user.owner_image}` : ''} imageTitle={user.owner_name}/>
                        <div className={style.OwnerInfo}>
                            <p>{user.owner_name}</p>
                            <p>{getDate(user.message_date)}</p>
                        </div>
                    </Link>
                    <span>
                        <Buttons.WhiteButton foo={() => deleteMedia()}>
                            <HiOutlineTrash/>
                        </Buttons.WhiteButton>
                        <Buttons.WhiteButton foo={() => shareMedia()}>
                            <HiOutlineShare/>
                        </Buttons.WhiteButton>
                        <Buttons.WhiteButton foo={() => downloadMedia()}>
                            <HiOutlineDocumentArrowDown/>
                        </Buttons.WhiteButton>
                        <Buttons.WhiteButton foo={() => {
                            dispatch(setZoom(!zoom))
                            zoomMedia(zoom ? 100 : 125)
                        }}>
                            {zoom ? <HiMagnifyingGlassMinus/> : <HiMagnifyingGlassPlus/>}
                        </Buttons.WhiteButton>
                        <Buttons.WhiteButton foo={() => animation.setState(prev => ({
                            ...prev,
                            state: false
                        }))}>
                            <HiOutlineXMark/>
                        </Buttons.WhiteButton>
                    </span>
                </div>
                {(!zoom && slide.slideNumber > 0) &&
                    <span className={style.LeftArrow}>
                        <Buttons.WhiteButton foo={() => swipeSlide(false)}>
                            <HiOutlineChevronLeft/>
                        </Buttons.WhiteButton>
                    </span>
                }
                {(!zoom && slide.slideNumber < media.mediaArr.length - 1) &&
                    <span className={style.RightArrow}>
                        <Buttons.WhiteButton foo={() => swipeSlide(true)}>
                            <HiOutlineChevronRight/>
                        </Buttons.WhiteButton>
                    </span>
                }
                {zoom &&
                    <span className={style.Zoom}>
                        <Buttons.WhiteButton foo={() => handleZoom(true)}>
                            <HiMagnifyingGlassMinus/>
                        </Buttons.WhiteButton>
                        <Inputs.RangeInput min={100} max={200} value={zoomSize} foo={zoomMedia} classNames={['RangeInput']}/>
                        <Buttons.WhiteButton foo={() => handleZoom(false)}>
                            <HiMagnifyingGlassPlus/>
                        </Buttons.WhiteButton>
                    </span>
                }
                <div className={style.Slider} onClick={() => animation.setState(prev => ({
                    ...prev,
                    state: false
                }))}>
                    <div className={style.Swipe} ref={refSwipe}>
                        {
                            media.mediaArr.map(media => (
                                <div key={media.message_file_id} className={style.ImageBlock}>
                                    <MediaTag.Slider media={media} key={media.message_file_id}/>
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