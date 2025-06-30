import React, {FC} from 'react'
import style from '@components/contacts/contactList/style.module.css'
import Member from "./Member"
import {ContactButton} from "../../../../../../../shared/ui/Button";
import {DropDownList} from "../../../../../../../shared/types";
import {ContactSchema} from "../../../../../../../5-entities/Contact";

interface ContactListProps {
    members: ContactSchema[],
    text?: string,
    dropList: (user_id: string) => DropDownList[]
}

const MembersList: FC<ContactListProps> = ({members, text, dropList}) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {members.map(member =>
                <ContactButton key={member.user_id}>
                    <Member contact={member} dropList={dropList(member.user_id)}/>
                </ContactButton>
            )}
        </section>
    )
}

export default MembersList