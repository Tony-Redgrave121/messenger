import React, { ChangeEvent, FC, RefObject } from 'react';
import style from './search-bar.module.css';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface ISearchBar {
    searchRef: RefObject<HTMLDivElement | null>;
    foo: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<ISearchBar> = ({ searchRef, foo }) => {
    return (
        <div className={style.SearchBar} ref={searchRef}>
            <HiOutlineMagnifyingGlass />
            <input className={style.SearchInput} placeholder="Search" onChange={foo}></input>
        </div>
    );
};

export default SearchBar;
