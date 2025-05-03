import React, {ChangeEvent, FC, ReactNode, useRef} from 'react'
import style from './style.module.css'
import {
    HiMiniSpeakerWave,
    HiMiniSpeakerXMark,
} from "react-icons/hi2"
import {useAppSelector} from "@hooks/useRedux";
import {CSSTransition} from "react-transition-group"
import './animations/animationCreateButton.css'

interface IDefaultButton {
    children?: ReactNode,
    foo?: (event?: React.MouseEvent<any>) => void
}

interface ISwitchButton extends IDefaultButton {
    state: boolean | number,
}

interface IFormButton extends IDefaultButton {
    type?: "button" | "submit" | "reset" | undefined
}

interface ICheckbox {
    children?: ReactNode,
    foo?: (event?: ChangeEvent<any>) => void,
    state: boolean
}

interface IRadioButton {
    foo?: (event?: ChangeEvent<any>) => void,
    state: boolean,
    text: string | number,
    desc?: string | number,
}

interface IVolumeButton {
    handleVolume?: () => void,
}

interface IPlayerButton {
    foo?: () => void,
    children: ReactNode,
    className?: string
}

interface ISettingButton {
    foo?: () => void,
    children?: ReactNode,
    text: string | number,
    desc?: string | number,
    isRed?: boolean
}

interface ISwitchSettingButton {
    foo?: () => void,
    children?: ReactNode,
    text: string,
    state: boolean | number
}

interface ICreateButton {
    foo?: () => void,
    state: boolean,
    children: ReactNode,
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
    export const RadioButton: FC<IRadioButton> = ({foo, text, desc, state}) => {
        return (
            <label className={style.RadioButtonContainer}>
                <input type="radio" onChange={foo} checked={state}/>
                <p>{text} {desc?.toString && <small className={style.GreySmall}>{desc}</small>}</p>
            </label>
        )
    }
    export const ContactButton: FC<IDefaultButton> = ({children, foo}) => {
        return (
            <button className={style.ContactButton} onClick={foo}>{children}</button>
        )
    }
    export const PlayerButton: FC<IPlayerButton> = ({foo, children, className}) => {
        return (
            <button onClick={foo} className={className && style[className]}>
                {children}
            </button>
        )
    }
    export const VolumeButton: FC<IVolumeButton> = ({handleVolume}) => {
        const volume = useAppSelector(state => state.slider.volume)

        return (
            <button onClick={handleVolume} className={style.PlayButtonMini}>
                {volume > 0 ? <HiMiniSpeakerWave/> : <HiMiniSpeakerXMark/>}
            </button>
        )
    }
    export const SettingButton: FC<ISettingButton> = ({foo, children, text, desc, isRed}) => {
        return (
            <button onClick={foo} className={`${style.SettingButton} ${isRed && style.SettingButtonRed}`} >
                {children}
                <p>{text} {desc?.toString && <small className={style.GreySmall}>{desc}</small>}</p>
            </button>
        )
    }
    export const SwitchSettingButton: FC<ISwitchSettingButton> = ({foo, children, text, state}) => {
        return (
            <button onClick={foo} className={style.SettingButton}>
                <span>
                    {children}
                    <p>{text}</p>
                </span>
                <Buttons.SwitchButton state={state} foo={foo}/>
            </button>
        )
    }
    export const CreateButton: FC<ICreateButton> = ({foo, children, state}) => {
        const refButton = useRef<HTMLButtonElement>(null)

        return (
            <CSSTransition
                in={state}
                nodeRef={refButton}
                timeout={300}
                classNames='create-button'
                unmountOnExit
            >
                <span className={style.CreateButton} ref={refButton}>
                    <Buttons.InterButton foo={foo}>
                        {children}
                    </Buttons.InterButton>
                </span>
            </CSSTransition>
        )
    }
}

export default Buttons