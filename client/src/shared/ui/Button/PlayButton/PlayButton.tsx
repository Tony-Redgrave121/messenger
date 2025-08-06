import { clsx } from 'clsx';
import React, { FC, ReactNode } from 'react';
import style from '../button.module.css';
import playButtonStyle from './play-button.module.css';

interface IPlayButton {
    foo?: () => void;
    children: ReactNode;
    isMini?: boolean;
}

const PlayButton: FC<IPlayButton> = ({ foo, children, isMini }) => {
    return (
        <button
            onClick={foo}
            className={clsx(isMini ? style.PlayButtonMini : playButtonStyle.PlayButton)}
            aria-label="Play"
        >
            {children}
        </button>
    );
};

export default PlayButton;
