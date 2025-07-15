import React, { FC, ReactNode } from 'react';
import style from './top-bar.module.css';

interface ITopBarProps {
    children: ReactNode;
}

const TopBar: FC<ITopBarProps> = ({ children }) => {
    return <div className={style.TopBar}>{children}</div>;
};

export default TopBar;
