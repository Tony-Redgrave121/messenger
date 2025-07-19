import React, { FC, ReactNode } from 'react';
import style from '../button.module.css';

interface IDefaultButtonProps {
    children?: ReactNode;
    foo: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const DefaultButton: FC<IDefaultButtonProps> = ({ children, foo }) => {
    return (
        <button className={style.DefaultButton} onClick={foo}>
            {children}
        </button>
    );
};

DefaultButton.displayName = 'DefaultButton';

export default DefaultButton;
