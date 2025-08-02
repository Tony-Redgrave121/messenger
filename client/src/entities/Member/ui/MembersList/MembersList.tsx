import React, { FC, memo, useRef } from 'react';
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
    const refContainer = useRef<HTMLDivElement>(null);

    return (
        <section className={style.MembersListContainer} ref={refContainer}>
            {text && <p>{text}</p>}
            {members.map(member => (
                <ContactButton key={member.user_id}>
                    <Member
                        refContainer={refContainer}
                        contact={member}
                        dropList={dropList(member.user_id)}
                    />
                </ContactButton>
            ))}
        </section>
    );
});

MembersList.displayName = 'MembersList';

export default MembersList;
