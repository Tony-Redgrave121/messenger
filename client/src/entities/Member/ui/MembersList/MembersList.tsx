import React, { FC } from 'react';
import style from '@features/ContactList/ui/style.module.css';
import { Member } from '@entities/Member';
import { DropDownList } from '@shared/types';
import { ContactButton } from '@shared/ui/Button';
import { ContactSchema } from '../../../Contact';

interface ContactListProps {
    members: ContactSchema[];
    text?: string;
    dropList: (user_id: string) => DropDownList[];
}

const MembersList: FC<ContactListProps> = ({ members, text, dropList }) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {members.map(member => (
                <ContactButton key={member.user_id}>
                    <Member contact={member} dropList={dropList(member.user_id)} />
                </ContactButton>
            ))}
        </section>
    );
};

export default MembersList;
