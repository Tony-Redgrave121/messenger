import { clsx } from 'clsx';
import React, { FC, ReactNode } from 'react';
import style from '../button.module.css';
import whiteButtonStyle from './white-button.module.css';

interface IWhiteButtonProps {
    children?: ReactNode;
    foo?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const WhiteButton: FC<IWhiteButtonProps> = ({ foo, children }) => {
    return (
        <button className={clsx(style.DefaultButton, whiteButtonStyle.WhiteButton)} onClick={foo}>
            {children}
        </button>
    );
};

export default WhiteButton;
