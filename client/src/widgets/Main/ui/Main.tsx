import {FC, ReactNode, useEffect, useRef} from 'react'
import style from './style.module.css'
import './main.animation.css'
import img from '@shared/assets/images/pattern.webp'
import {CSSTransition} from 'react-transition-group'
import {useAppDispatch, useAppSelector} from "@shared/lib";
import {syncNotifications} from "@entities/Messenger/lib/thunk/messengerThunk";

interface IMainContainer {
    children?: ReactNode
}

const Main: FC<IMainContainer> = ({children}) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const wrapperState = useAppSelector(state => state.wrapper.wrapperState)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(syncNotifications())
    }, [])

    return (
        <main style={{backgroundImage: `url('${img}')`}} className={style.MainContainer}>
            <CSSTransition
                in={wrapperState}
                nodeRef={wrapperRef}
                timeout={300}
                classNames='wrapper-node'
                unmountOnExit
            >
                <div className={style.Wrapper} ref={wrapperRef}>
                    {children}
                </div>
            </CSSTransition>
        </main>
    )
}

export default Main