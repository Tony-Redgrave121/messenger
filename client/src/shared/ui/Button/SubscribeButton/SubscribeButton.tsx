import React, { FC, ReactNode } from 'react';
import style from './subscribe-button.module.css';

interface ISubscribeButtonProps {
    onClickFoo: () => void;
    children: ReactNode;
}

const SubscribeButton: FC<ISubscribeButtonProps> = ({ onClickFoo, children }) => {
    return (
        <button className={style.SubscribeButton} onClick={onClickFoo}>
            {children}
        </button>
    );
};

export default SubscribeButton;
