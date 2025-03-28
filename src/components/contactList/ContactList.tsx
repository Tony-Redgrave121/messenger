import React from 'react'
import style from './style.module.css'
import Contact from "../contacts/Contact";
import useGetContacts from "../../utils/hooks/useGetContacts";
import Buttons from "../buttons/Buttons";

const ContactList = () => {
    const {contacts} = useGetContacts()

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