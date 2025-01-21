import React from 'react'
import style from './style.module.css'

const MainContainer = () => {
    const backgrounds = [
        './backgrounds/space-themed-repeated-background.webp',
        './backgrounds/black-and-white-space-themed-repeated-background.webp',
        './backgrounds/little-stars.png',
    ]

    return (
        <main style={{backgroundImage: `url(${backgrounds[2]})`}} className={style.MainContainer}>

        </main>
    )
}

export default MainContainer