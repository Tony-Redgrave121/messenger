import React from 'react'
import style from './style.module.css'
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"

const SearchBlock = () => {
    return (
        <div className={style.SearchContainer}>
            <HiOutlineMagnifyingGlass className={style.SearchIcon}/>
            <input className={style.SearchInput} placeholder='Search'></input>
        </div>
    )
}

export default SearchBlock