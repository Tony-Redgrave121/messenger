import React, {FC, ReactNode} from 'react'
import style from './contact-button.module.css'

interface IContactButtonProps {
    children?: ReactNode,
    foo?: (event?: React.MouseEvent<HTMLButtonElement>) => void
}

const ContactButton: FC<IContactButtonProps> = ({children, foo}) => {
    return (
        <button className={style.ContactButton} onClick={foo}>{children}</button>
    )
}

export default ContactButton