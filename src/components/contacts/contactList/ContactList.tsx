import React, {FC} from 'react'
import style from './style.module.css'
import {Contact} from "../"
import {Buttons} from "@components/buttons"
import {IContact} from "@appTypes"

interface ContactListProps {
    contacts: IContact[],
    text: string,
    childrenFront?: React.ReactNode,
}

const ContactList: FC<ContactListProps> = ({contacts, text, childrenFront}) => {
    return (
        <section className={style.ContactListContainer}>
            <p>{text}</p>
            {contacts.map(contact =>
                <Buttons.ContactButton key={contact.user_id}>
                    <Contact contact={contact} childrenFront={childrenFront}/>
                </Buttons.ContactButton>
            )}
        </section>
    )
}

export default ContactList