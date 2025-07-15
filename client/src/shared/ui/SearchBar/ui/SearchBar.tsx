import React, { ChangeEvent, FC, RefObject } from 'react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import style from './search-bar.module.css';

interface ISearchBarProps {
    searchRef: RefObject<HTMLDivElement | null>;
    foo: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<ISearchBarProps> = ({ searchRef, foo }) => {
    return (
        <div className={style.SearchBar} ref={searchRef}>
            <HiOutlineMagnifyingGlass />
            <input className={style.SearchInput} placeholder="Search" onChange={foo}></input>
        </div>
    );
};

export default SearchBar;
