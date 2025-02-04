import React from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"
import FilesState from "../../utils/types/FilesState";

interface IPopup {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<FilesState>>,
    children?: React.ReactNode,
}

const PopupContainer: React.FC<IPopup> = ({state, setState, children}) => {
    const refDiv = React.useRef<HTMLDivElement>(null)

    return (
        <CSSTransition
            in={state}
            nodeRef={refDiv}
            timeout={300}
            classNames='popup-node'
            unmountOnExit
        >
            <div className={style.PopupContainer} ref={refDiv} onClick={() => setState(prev => ({...prev, popup: false}))}>
                <div onClick={event => event.stopPropagation()}>
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}

export default PopupContainer