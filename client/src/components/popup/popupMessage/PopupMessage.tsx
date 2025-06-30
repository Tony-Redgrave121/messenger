import {useEffect, useRef} from 'react'
import style from './style.module.css'
import '../../../rebuild/shared/ui/Popup/popup-animation.css'
import {CSSTransition} from "react-transition-group"
import {useAppDispatch, useAppSelector} from "../../../rebuild/shared/lib";
import {setPopupMessageState} from "../../../store/reducers/appReducer";

const PopupMessage= () => {
    const refDiv = useRef<HTMLDivElement>(null)

    const {popupMessageChildren, popupMessageState} = useAppSelector(state => state.app)
    const dispatch = useAppDispatch()

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        if (popupMessageState) {
            timer = setTimeout(() => dispatch(setPopupMessageState(false)), 3000)
        }

        return () => {
            timer && clearTimeout(timer)
        }
    }, [dispatch, popupMessageState])

    return (
        <CSSTransition
            in={popupMessageState}
            nodeRef={refDiv}
            timeout={300}
            classNames='popup-node'
            unmountOnExit
        >
            <div className={style.PopupContainer} ref={refDiv}>
                <p>{popupMessageChildren}</p>
            </div>
        </CSSTransition>
    )
}

export default PopupMessage