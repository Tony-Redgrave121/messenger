import React, { FC, memo } from 'react';
import Contact from '@entities/Contact/ui/Contact/Contact';
import { ContactSchema } from '@shared/types';
import { ContactButton } from '@shared/ui/Button';
import style from './style.module.css';

interface ContactListProps {
    contacts: ContactSchema[];
    text?: string;
    onClick: (user_id: string) => void;
}

const ContactList: FC<ContactListProps> = memo(({ contacts, text, onClick }) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {contacts.length > 0 &&
                contacts.map(contact => (
                    <ContactButton key={contact.user_id} foo={() => onClick(contact.user_id)}>
                        <Contact contact={contact} />
                    </ContactButton>
                ))}
        </section>
    );
});

ContactList.displayName = 'ContactList';

export default ContactList;
