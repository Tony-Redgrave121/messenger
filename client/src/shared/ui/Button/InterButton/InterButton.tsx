import React, { FC, ReactNode } from 'react';
import style from './inter-button.module.css';

interface IDefaultButtonProps {
    children?: ReactNode;
    foo: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    ariaLabel?: string;
}

const InterButton: FC<IDefaultButtonProps> = ({ children, foo, ariaLabel }) => {
    return (
        <button className={style.InterButton} onClick={foo} aria-label={ariaLabel}>
            {children}
        </button>
    );
};

export default InterButton;
