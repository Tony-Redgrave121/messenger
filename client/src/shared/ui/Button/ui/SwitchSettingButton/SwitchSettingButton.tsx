import React, { FC, memo, ReactNode } from 'react';
import { SwitchButton } from '../../index';
import buttonStyle from '../../styles/button.module.css';

interface ISwitchSettingButtonProps {
    foo: () => void;
    children?: ReactNode;
    text: string;
    state: boolean | number;
}

const SwitchSettingButton: FC<ISwitchSettingButtonProps> = memo(
    ({ foo, children, text, state }) => {
        return (
            <button onClick={foo} className={buttonStyle.SettingButton}>
                <span>
                    {children}
                    <p>{text}</p>
                </span>
                <SwitchButton state={state} foo={foo} />
            </button>
        );
    },
);

SwitchSettingButton.displayName = 'SwitchSettingButton';

export default SwitchSettingButton;
