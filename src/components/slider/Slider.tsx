import React from 'react'
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
    HiOutlineXMark
} from "react-icons/hi2";
import * as events from "node:events";

interface ISlider {
    ref: React.RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: (state: boolean) => void,
    media: Array<string>,
    owner: string,
    date: Date
}

const Slider: React.FC<ISlider> = ({ref, state, setState, media, owner, date}) => {
    return (
        <CSSTransition
            in={state}
            nodeRef={ref}
            timeout={300}
            classNames='slider-node'
            unmountOnExit
        >
            <div className={style.SliderContainer} ref={ref} onClick={() => setState(false)}>
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
            </div>
        </CSSTransition>
    )
}

export default Slider