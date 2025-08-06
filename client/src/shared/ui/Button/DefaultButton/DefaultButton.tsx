import React, { FC, ReactNode } from 'react';
import style from '../button.module.css';

interface IDefaultButtonProps {
    children?: ReactNode;
    foo: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    ariaLabel?: string;
}

const DefaultButton: FC<IDefaultButtonProps> = ({ children, foo, ariaLabel }) => {
    return (
        <button className={style.DefaultButton} onClick={foo} aria-label={ariaLabel}>
            {children}
        </button>
    );
};

DefaultButton.displayName = 'DefaultButton';

export default DefaultButton;
