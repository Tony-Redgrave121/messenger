import {FC, ReactNode, useRef} from 'react'
import style from './style.module.css'
import './popup-animation.css'
import {CSSTransition} from "react-transition-group"

interface IPopupProps {
    state: boolean,
    handleCancel: () => void,
    children?: ReactNode,
}

const Popup: FC<IPopupProps> = ({state, handleCancel, children}) => {
    const popupRef = useRef<HTMLDivElement | null>(null)

    return (
        <CSSTransition
            in={state}
            nodeRef={popupRef}
            timeout={300}
            classNames='popup-node'
            unmountOnExit
        >
            <div className={style.Popup} ref={popupRef} onClick={handleCancel}>
                <div onClick={event => event.stopPropagation()}>
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}

export default Popup