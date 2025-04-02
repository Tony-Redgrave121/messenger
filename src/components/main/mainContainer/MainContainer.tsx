import React from 'react'
import style from './style.module.css'
import img from './backgrounds/background.webp'

interface IMainContainer {
    children?: React.ReactNode
}

const MainContainer: React.FC<IMainContainer> = ({children}) => {
    return (
        <main style={{backgroundImage: `url('${img}')`}} className={style.MainContainer}>
            {children}
        </main>
    )
}

export default MainContainer