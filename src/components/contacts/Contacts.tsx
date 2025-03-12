import React from 'react';
import style from './style.module.css';
import IContact from "../../utils/types/IContact";
import {getDate} from "../../utils/logic/getDate";
import LoadFile from "../loadFile/LoadFile";

interface IContactsProps {
    contact: IContact
}

const Contacts: React.FC<IContactsProps> = ({contact}) => {
    return (
        <div className={style.ContactBlock}>
            <LoadFile imagePath={contact.contact_image ? `users/${contact.contact_id}/${contact.contact_image}` : ''} imageTitle={contact.contact_name} key={contact.contact_id}/>
            <div className={style.ContactInfo}>
                <h4>{contact.contact_name}</h4>
                <p>{getDate(contact.contact_last_seen)}</p>
            </div>
        </div>
    )
}

export default Contacts