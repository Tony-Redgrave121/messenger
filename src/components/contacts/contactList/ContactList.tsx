import React, {FC} from 'react'
import style from './style.module.css'
import {Contact} from "../"
import {Buttons} from "@components/buttons"
import {IContact} from "@appTypes"

interface ContactListProps {
    contacts: IContact[],
    text?: string,
    onClick: (user_id: string) => void
}

const ContactList: FC<ContactListProps> = ({contacts, text, onClick}) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {contacts.map(contact =>
                <Buttons.ContactButton key={contact.user_id}>
                    <Contact contact={contact} onClick={() => onClick(contact.user_id)}/>
                </Buttons.ContactButton>
            )}
        </section>
    )
}

export default ContactList