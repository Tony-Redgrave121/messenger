import React from 'react'
import style from './style.module.css'
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"

interface ISearchBlock {
    ref: React.RefObject<HTMLDivElement | null>
}

const SearchBlock: React.FC<ISearchBlock> = ({ref}) => {
    return (
        <div className={style.SearchContainer} ref={ref}>
            <HiOutlineMagnifyingGlass className={style.SearchIcon}/>
            <input className={style.SearchInput} placeholder='Search'></input>
        </div>
    )
}

export default SearchBlock