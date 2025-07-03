import {FC} from 'react';
import style from "./style.module.css";
import {HiMagnifyingGlass} from "react-icons/hi2";

interface INoResultProps {
    filter: string
}

const NoResult: FC<INoResultProps> = ({filter}) => {
    return (
        <div className={style.NoResultContainer}>
            <HiMagnifyingGlass/>
            <h1>No Results</h1>
            <p>There were no results for "{filter}".<br/> Try a new search.</p>
        </div>
    )
}

export default NoResult