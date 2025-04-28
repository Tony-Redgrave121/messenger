import React from 'react';
import style from './style.module.css';
import {IContact} from "@appTypes";
import {getDate} from "@utils/logic/getDate";
import {LoadFile} from "../loadFile";

interface IContactsProps {
    contact: IContact,
    children?: React.ReactNode,
    childrenFront?: React.ReactNode,
}

const Contact: React.FC<IContactsProps> = ({contact, children, childrenFront}) => {
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
            {childrenFront}
        </div>
    )
}

export default Contact