import React, {FC, memo} from 'react'
import style from './style.module.css'
import {Contact} from "../"
import {Buttons} from "@components/buttons"
import {IContact} from "@appTypes"

interface ContactListProps {
    contacts: IContact[],
    text?: string,
    onClick: (user_id: string) => void
}

const ContactList: FC<ContactListProps> = memo(({contacts, text, onClick}) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {contacts.length && contacts.map(contact =>
                <Buttons.ContactButton key={contact.user_id} foo={() => onClick(contact.user_id)}>
                    <Contact contact={contact}/>
                </Buttons.ContactButton>
            )}
        </section>
    )
})

export default ContactList