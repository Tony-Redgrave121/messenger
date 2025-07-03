import React, {FC, memo} from 'react'
import style from './style.module.css'
import {ContactButton} from "@shared/ui/Button";
import {Contact, ContactSchema} from "@entities/Contact";

interface ContactListProps {
    contacts: ContactSchema[],
    text?: string,
    onClick: (user_id: string) => void
}

const ContactList: FC<ContactListProps> = memo(({contacts, text, onClick}) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {contacts.length && contacts.map(contact =>
                <ContactButton key={contact.user_id} foo={() => onClick(contact.user_id)}>
                    <Contact contact={contact}/>
                </ContactButton>
            )}
        </section>
    )
})

export default ContactList