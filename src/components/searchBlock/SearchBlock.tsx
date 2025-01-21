import React from 'react'
import style from './style.module.css'

const SearchBlock = () => {
    return (
        <div className={style.SearchContainer}>
            <input className={style.SearchInput}></input>
        </div>
    )
}

export default SearchBlock