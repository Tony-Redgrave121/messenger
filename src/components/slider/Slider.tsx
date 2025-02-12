import React, {useRef} from 'react'
import style from './style.module.css'
import {CSSTransition} from 'react-transition-group'
import './animation.css'
import LoadFile from "../loadFile/LoadFile";
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
import useSlider from "../../utils/hooks/useSlider";
import MediaTag from "../media/mediaTag/MediaTag";

interface ISlider {
    animation: {
        state: boolean,
        setState: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.RefObject<HTMLDivElement | null>
    },
    media: {
        mediaArr: { message_file_id: string, message_file_name: string }[],
        setMediaArr: React.Dispatch<React.SetStateAction<{ message_file_id: string, message_file_name: string; }[] | undefined>>,
        currentSlide: { message_file_id: string, message_file_name: string}
    },
    user: {
        owner_id: string,
        owner_image: string,
        owner_name: string,
        message_date: Date,
    }
}

const Slider: React.FC<ISlider> = ({animation, media, user}) => {
    const refSwipe = useRef<HTMLDivElement | null>(null)

    const {downloadMedia, deleteMedia, swipeSlide, zoomMedia, setZoomState, zoomState, shareMedia, slide, zoomSize} = useSlider({
        mediaArr: media.mediaArr,
        setMediaArr: media.setMediaArr,
        currentSlide: media.currentSlide,
        animationState: animation.state,
        setAnimationState: animation.setState,
        refSwipe,
    })

    const handleZoom = (side: boolean) => {
        const newZoom = side ? zoomSize - 20 : zoomSize + 20

        if (newZoom >= 100 && newZoom <= 200) zoomMedia(newZoom.toString())
        else side ? zoomMedia('100') : zoomMedia('200')
    }

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
                        <LoadFile imagePath={user.owner_image ? `users/${user.owner_id}/${user.owner_image}` : ''} imageTitle={user.owner_name}/>
                        <div>
                            <h4>{user.owner_name}</h4>
                            <p>{getDate(user.message_date)}</p>
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
                        <Button.WhiteButton foo={() => {
                            setZoomState(!zoomState)
                            zoomMedia(zoomState ? '100' : '125')
                        }}>
                            {zoomState ? <HiMagnifyingGlassMinus/> : <HiMagnifyingGlassPlus/>}
                        </Button.WhiteButton>
                        <Button.WhiteButton foo={() => animation.setState(false)}>
                            <HiOutlineXMark/>
                        </Button.WhiteButton>
                    </span>
                </div>
                {(!zoomState && slide.slideNumber > 0) &&
                    <span className={style.LeftArrow}>
                        <Button.WhiteButton foo={() => swipeSlide(false)}>
                            <HiOutlineChevronLeft/>
                        </Button.WhiteButton>
                    </span>
                }
                {(!zoomState && slide.slideNumber < media.mediaArr.length - 1) &&
                    <span className={style.RightArrow}>
                        <Button.WhiteButton foo={() => swipeSlide(true)}>
                            <HiOutlineChevronRight/>
                        </Button.WhiteButton>
                    </span>
                }
                {zoomState &&
                    <span className={style.Zoom}>
                        <Button.WhiteButton foo={() => handleZoom(true)}>
                            <HiMagnifyingGlassMinus/>
                        </Button.WhiteButton>
                        <input type="range" min={100} max={200} value={zoomSize} onChange={(event) => zoomMedia(event.target.value)}/>
                        <Button.WhiteButton foo={() => handleZoom(false)}>
                            <HiMagnifyingGlassPlus/>
                        </Button.WhiteButton>
                    </span>
                }
                <div className={style.Slider} onClick={() => animation.setState(false)}>
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