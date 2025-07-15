import { FC } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import style from './no-result.module.css';

interface INoResultProps {
    filter: string;
}

const NoResult: FC<INoResultProps> = ({ filter }) => {
    return (
        <div className={style.NoResultContainer}>
            <HiMagnifyingGlass />
            <h1>No Results</h1>
            <p>
                There were no results for &#34;{filter}&#34;.
                <br /> Try a new search.
            </p>
        </div>
    );
};

export default NoResult;
