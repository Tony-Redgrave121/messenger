import React from 'react';
import style from './style.module.css'

interface IDefaultButton {
    children?: React.ReactNode,
    foo?: () => void
}

interface ISwitchButton extends IDefaultButton {
    state: boolean,
}

namespace Buttons {
    export const DefaultButton: React.FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.DefaultButton} onClick={foo}>{children}</button>
        )
    }
    export const InterButton: React.FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.InterButton} onClick={foo}>{children}</button>
        )
    }
    export const SwitchButton: React.FC<ISwitchButton> = ({foo, state}) => {
        return (
            <button className={`${style.SwitchButton} ${state && style.SwitchButtonOn}`} onClick={foo}></button>
        )
    }
    export const WhiteButton: React.FC<IDefaultButton> = ({foo, children, ...props}) => {
        return (
            <button className={`${style.DefaultButton} ${style.WhiteButton}`} onClick={foo} {...props}>{children}</button>
        )
    }
}

export default Buttons