import React, {FC, ReactNode} from 'react'
import buttonStyle from '../../styles/button.module.css'
import {SwitchButton} from "../../index"

interface ISwitchSettingButtonProps {
    foo: () => void,
    children?: ReactNode,
    text: string,
    state: boolean | number
}

const SwitchSettingButton: FC<ISwitchSettingButtonProps> = ({foo, children, text, state}) => {
    return (
        <button onClick={foo} className={buttonStyle.SettingButton}>
            <span>
                {children}
                <p>{text}</p>
            </span>
            <SwitchButton state={state} foo={foo}/>
        </button>
    )
}

export default SwitchSettingButton