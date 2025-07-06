import React, { FC, ReactNode } from 'react';
import buttonStyle from '../../styles/button.module.css';
import whiteButtonStyle from './white-button.module.css';
import { clsx } from 'clsx';

interface IWhiteButtonProps {
    children?: ReactNode;
    foo?: (event?: React.MouseEvent<any>) => void;
}

const WhiteButton: FC<IWhiteButtonProps> = ({ foo, children }) => {
    return (
        <button
            className={clsx(buttonStyle.DefaultButton, whiteButtonStyle.WhiteButton)}
            onClick={foo}
        >
            {children}
        </button>
    );
};

export default WhiteButton;
