import React from 'react'
import style from './style.module.css'
import img from './backgrounds/little-stars.png'

interface IMainContainer {
    children?: React.ReactNode
}

const MainContainer: React.FC<IMainContainer> = ({children}) => {
    const backgrounds = [
        './backgrounds/space-themed-repeated-background.webp',
        './backgrounds/black-and-white-space-themed-repeated-background.webp',
        './backgrounds/little-stars.png',
    ]

    return (
        <main style={{backgroundImage: `url('${img}')`}} className={style.MainContainer}>
            {children}
        </main>
    )
}

export default MainContainer