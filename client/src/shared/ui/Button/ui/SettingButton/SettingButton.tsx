import { FC, ReactNode } from 'react';
import buttonStyle from '../../styles/button.module.css';
import settingButtonStyle from './setting-button.module.css';
import { clsx } from 'clsx';

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
            className={clsx(
                buttonStyle.SettingButton,
                isRed && settingButtonStyle.SettingButtonRed,
            )}
        >
            {children}
            <p>
                {text} {desc?.toString && <small className={settingButtonStyle.Desk}>{desc}</small>}
            </p>
        </button>
    );
};

export default SettingButton;
