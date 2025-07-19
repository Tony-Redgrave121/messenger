import { clsx } from 'clsx';
import { FC } from 'react';
import style from './switch-button.module.css';

interface ISwitchButtonProps {
    foo: () => void;
    state: boolean | number;
}

const SwitchButton: FC<ISwitchButtonProps> = ({ foo, state }) => {
    return (
        <div
            className={clsx(style.SwitchButton, state && style.SwitchButtonOn)}
            onClick={foo}
        ></div>
    );
};

export default SwitchButton;
