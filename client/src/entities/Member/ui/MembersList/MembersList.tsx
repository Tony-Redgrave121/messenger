import React, { FC, memo } from 'react';
import { ContactSchema, DropDownList } from '@shared/types';
import { ContactButton } from '@shared/ui/Button';
import Member from '../Member/Member';
import style from './members-list.module.css';

interface ContactListProps {
    members: ContactSchema[];
    text?: string;
    dropList: (user_id: string) => DropDownList[];
}

const MembersList: FC<ContactListProps> = memo(({ members, text, dropList }) => {
    return (
        <section className={style.MembersListContainer}>
            {text && <p>{text}</p>}
            {members.map(member => (
                <ContactButton key={member.user_id}>
                    <Member contact={member} dropList={dropList(member.user_id)} />
                </ContactButton>
            ))}
        </section>
    );
});

MembersList.displayName = 'MembersList';

export default MembersList;
