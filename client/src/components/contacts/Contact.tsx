import {FC, ReactNode} from 'react';
import style from './style.module.css';
import {getDate} from "../../rebuild/shared/lib";
import {LoadFile} from "../loadFile";
import {ContactSchema} from "../../rebuild/5-entities/Contact";

interface IContactsProps {
    contact: ContactSchema,
    children?: ReactNode,
}

const Contact: FC<IContactsProps> = ({contact, children}) => {
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