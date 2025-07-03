import {FC, ReactNode} from 'react';
import style from './style.module.css';
import {getDate} from "@shared/lib";
import {LoadFile} from "@shared/ui/LoadFile";
import {ContactSchema} from "../index";

interface IContactProps {
    contact: ContactSchema,
    children?: ReactNode,
}

const Contact: FC<IContactProps> = ({contact, children}) => {
    return (
        <div className={style.ContactBlock}>
            {children}
            <span>
                <LoadFile imagePath={contact.user_img ? `users/${contact.user_id}/${contact.user_img}` : ''} imageTitle={contact.user_name}/>
            </span>
            <div className={style.ContactInfo}>
                <h4>{contact.user_name}</h4>
                <p>{getDate(contact.user_last_seen)}</p>
            </div>
        </div>
    )
}

export default Contact