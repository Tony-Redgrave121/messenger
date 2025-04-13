import React from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"
import {IFilesState} from "@appTypes";

interface IPopup {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<IFilesState>>,
    children?: React.ReactNode,
}

const PopupContainer: React.FC<IPopup> = ({state, setState, children}) => {
    const refDiv = React.useRef<HTMLDivElement>(null)

    const handleCancel = () => {
        setState(prev => ({...prev, popup: false}))

        setTimeout(() => setState({
            files: null,
            popup: false,
            type: ''
        }), 300)
    }

    return (
        <CSSTransition
            in={state}
            nodeRef={refDiv}
            timeout={300}
            classNames='popup-node'
            unmountOnExit
        >
            <div className={style.PopupContainer} ref={refDiv} onClick={handleCancel}>
                <div onClick={event => event.stopPropagation()}>
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}

export default PopupContainer