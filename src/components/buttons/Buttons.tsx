import React, {ChangeEvent, FC, ReactNode} from 'react'
import style from './style.module.css'
import {HiPlay} from "react-icons/hi2"

interface IDefaultButton {
    children?: ReactNode,
    foo?: (event?: React.MouseEvent<any>) => void
}

interface ISwitchButton extends IDefaultButton {
    state: boolean,
}

interface IFormButton extends IDefaultButton {
    type?: "button" | "submit" | "reset" | undefined
}

interface ICheckbox {
    children?: ReactNode,
    foo?: (event?: ChangeEvent<any>) => void,
    state: boolean
}

interface IPlayButton {
    handlePlay?: () => void,
    pause: boolean
}

namespace Buttons {
    export const DefaultButton: FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.DefaultButton} onClick={foo}>{children}</button>
        )
    }
    export const InterButton: FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.InterButton} onClick={foo}>{children}</button>
        )
    }
    export const SwitchButton: FC<ISwitchButton> = ({foo, state}) => {
        return (
            <div className={`${style.SwitchButton} ${state && style.SwitchButtonOn}`} onClick={foo}></div>
        )
    }
    export const WhiteButton: FC<IDefaultButton> = ({foo, children, ...props}) => {
        return (
            <button className={`${style.DefaultButton} ${style.WhiteButton}`} onClick={foo} {...props}>{children}</button>
        )
    }
    export const FormButton: FC<IFormButton> = ({foo, children, type}) => {
        return (
            <button className={style.FormButton} onClick={foo} type={type}>{children}</button>
        )
    }
    export const Checkbox: FC<ICheckbox> = ({foo, children, state}) => {
        return (
            <label className={style.CheckboxContainer}>
                <input type="checkbox" onChange={foo} checked={state}/>
                {children}
            </label>
        )
    }
    export const ContactButton: FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.ContactButton} onClick={foo}>{children}</button>
        )
    }
    export const PlayButton: FC<IPlayButton> = ({handlePlay, pause}) => {
        return (
            <button onClick={handlePlay} className={style.PlayButton}>
                {pause && <HiPlay/>}
            </button>
        )
    }
}

export default Buttons