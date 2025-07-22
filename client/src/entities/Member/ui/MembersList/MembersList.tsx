import React, { FC, memo } from 'react';
import Member from '@entities/Member/ui/Member/Member';
import { ContactSchema, DropDownList } from '@shared/types';
import { ContactButton } from '@shared/ui';
import style from './members-list.module.css';

interface ContactsListProps {
    members: ContactSchema[];
    text?: string;
    dropList: (user_id: string) => DropDownList[];
}

const MembersList: FC<ContactsListProps> = memo(({ members, text, dropList }) => {
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
