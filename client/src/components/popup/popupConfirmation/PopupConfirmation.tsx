import {FC} from 'react'
import style from './style.module.css'
import '../animation.css'

interface IPopupConfirmationProps {
    onConfirm: () => void,
    onCancel: () => void,
    title: string,
    text: string,
    confirmButtonText: string,
}

const PopupConfirmation: FC<IPopupConfirmationProps> = ({onCancel, onConfirm, title, text, confirmButtonText}) => {

    return (
        <>
            <div className={style.PopupBlock}>
                <p>{title}</p>
                <p>{text}</p>
                <span>
                   <button onClick={onCancel}>Cancel</button>
                   <button onClick={onConfirm}>{confirmButtonText}</button>
                </span>
            </div>
        </>
    )
}

export default PopupConfirmation