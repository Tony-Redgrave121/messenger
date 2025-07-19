import { clsx } from 'clsx';
import { FC, ReactNode } from 'react';
import style from '../button.module.css';
import settingButtonStyle from './setting-button.module.css';

interface ISettingButtonProps {
    foo?: () => void;
    children?: ReactNode;
    text: string | number;
    desc?: string | number;
    isRed?: boolean;
}

const SettingButton: FC<ISettingButtonProps> = ({ foo, children, text, desc, isRed }) => {
    return (
        <button
            onClick={foo}
            className={clsx(style.SettingButton, isRed && settingButtonStyle.SettingButtonRed)}
        >
            {children}
            <p>
                {text} {desc?.toString && <small className={settingButtonStyle.Desk}>{desc}</small>}
            </p>
        </button>
    );
};

export default SettingButton;
