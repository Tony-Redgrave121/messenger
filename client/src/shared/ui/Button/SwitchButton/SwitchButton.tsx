import { clsx } from 'clsx';
import { FC } from 'react';
import style from './switch-button.module.css';

interface ISwitchButtonProps {
    state: boolean | number;
}

const SwitchButton: FC<ISwitchButtonProps> = ({ state }) => {
    return <div className={clsx(style.SwitchButton, state && style.SwitchButtonOn)} />;
};

export default SwitchButton;
