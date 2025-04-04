import React from 'react';
import style from './style.module.css'

interface IDefaultButton {
    children?: React.ReactNode,
    foo?: (event?: React.MouseEvent<any>) => void
}

interface ISwitchButton extends IDefaultButton {
    state: boolean,
}

interface IFormButton extends IDefaultButton {
    type?: "button" | "submit" | "reset" | undefined
}

interface ICheckbox {
    children?: React.ReactNode,
    foo?: (event?: React.ChangeEvent<any>) => void,
    state: boolean
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
            <div className={`${style.SwitchButton} ${state && style.SwitchButtonOn}`} onClick={foo}></div>
        )
    }
    export const WhiteButton: React.FC<IDefaultButton> = ({foo, children, ...props}) => {
        return (
            <button className={`${style.DefaultButton} ${style.WhiteButton}`} onClick={foo} {...props}>{children}</button>
        )
    }
    export const FormButton: React.FC<IFormButton> = ({foo, children, type}) => {
        return (
            <button className={style.FormButton} onClick={foo} type={type}>{children}</button>
        )
    }
    export const Checkbox: React.FC<ICheckbox> = ({foo, children, state}) => {
        return (
            <label className={style.CheckboxContainer}>
                <input type="checkbox" onChange={foo} checked={state}/>
                {children}
            </label>
        )
    }
    export const ContactButton: React.FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.ContactButton} onClick={foo}>{children}</button>
        )
    }
}

export default Buttons