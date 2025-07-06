import React, { FC, ReactNode } from 'react';
import buttonStyle from '../../styles/button.module.css';
import playButtonStyle from './play-button.module.css';
import { clsx } from 'clsx';

interface IPlayButton {
    foo?: () => void;
    children: ReactNode;
    isMini?: boolean;
}

const PlayButton: FC<IPlayButton> = ({ foo, children, isMini }) => {
    return (
        <button
            onClick={foo}
            className={clsx(isMini ? buttonStyle.PlayButtonMini : playButtonStyle.PlayButton)}
        >
            {children}
        </button>
    );
};

export default PlayButton;
