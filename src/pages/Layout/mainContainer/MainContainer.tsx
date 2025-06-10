import React, {FC, ReactNode, useRef} from 'react'
import style from './style.module.css'
import img from './backgrounds/pattern.webp'
import {CSSTransition} from 'react-transition-group'
import {useAppSelector} from "@hooks/useRedux";

interface IMainContainer {
    children?: ReactNode
}

const MainContainer: FC<IMainContainer> = ({children}) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const wrapperState = useAppSelector(state => state.app.wrapperState)

    return (
        <CSSTransition
            in={wrapperState}
            nodeRef={wrapperRef}
            timeout={200}
            classNames='message-scale-node'
            unmountOnExit
        >
            <main style={{backgroundImage: `url('${img}')`}} className={style.MainContainer}>
                <div className={style.Wrapper} ref={wrapperRef}>
                    {children}
                </div>
            </main>
        </CSSTransition>
    )
}

export default MainContainer