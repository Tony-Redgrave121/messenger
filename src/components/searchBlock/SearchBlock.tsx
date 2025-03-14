import React from 'react'
import style from './style.module.css'
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"

interface ISearchBlock {
    ref: React.RefObject<HTMLDivElement | null>,
    foo: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBlock: React.FC<ISearchBlock> = ({ref, foo}) => {
    return (
        <div className={style.SearchContainer} ref={ref}>
            <HiOutlineMagnifyingGlass className={style.SearchIcon}/>
            <input className={style.SearchInput} placeholder='Search' onChange={foo}></input>
        </div>
    )
}

export default SearchBlock