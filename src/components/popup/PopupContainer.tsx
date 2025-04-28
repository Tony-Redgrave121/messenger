import {FC, ReactNode, useRef} from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"

interface IPopup {
    state: boolean,
    handleCancel: () => void,
    children?: ReactNode,
}

const PopupContainer: FC<IPopup> = ({state, handleCancel, children}) => {
    const refDiv = useRef<HTMLDivElement>(null)

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