import {FC, ReactNode, useRef} from 'react'
import style from './style.module.css'
import './animation.css'
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

export default MainContainer