import React, {FC, ReactNode} from 'react'
import style from './style.module.css'
import img from './backgrounds/pattern.svg'

interface IMainContainer {
    children?: ReactNode
}

const MainContainer: FC<IMainContainer> = ({children}) => {
    return (
        <main style={{backgroundImage: `url('${img}')`}} className={style.MainContainer}>
            {children}
        </main>
    )
}

export default MainContainer