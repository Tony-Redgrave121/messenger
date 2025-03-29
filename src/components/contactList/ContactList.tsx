import React from 'react'
import style from './style.module.css'
import Contact from "../contacts/Contact"
import Buttons from "../buttons/Buttons"
import IContact from "../../utils/types/IContact"

interface ContactListProps {
    contacts: IContact[]
}

const ContactList: React.FC<ContactListProps> = ({contacts}) => {
    return (
        <section className={style.ContactListContainer}>
            <p>Contacts</p>
            {contacts.map(contact =>
                <Buttons.ContactButton key={contact.user_id}>
                    <Contact contact={contact} />
                </Buttons.ContactButton>
            )}
        </section>
    )
}

export default ContactList