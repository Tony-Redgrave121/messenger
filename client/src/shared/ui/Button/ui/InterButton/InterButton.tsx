import React, { FC, ReactNode } from 'react';
import style from './inter-button.module.css';

interface IDefaultButtonProps {
    children?: ReactNode;
    foo: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const InterButton: FC<IDefaultButtonProps> = ({ children, foo }) => {
    return (
        <button className={style.InterButton} onClick={foo}>
            {children}
        </button>
    );
};

export default InterButton;
