import {FC} from 'react'
import style from './style.module.css'
import '../animation.css'
import Buttons from "@components/buttons/Buttons";

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
                <Buttons.FormButton>

                </Buttons.FormButton>
            </div>
        </>
    )
}

export default PopupConfirmation