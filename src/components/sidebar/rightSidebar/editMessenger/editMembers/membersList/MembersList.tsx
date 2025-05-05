import React, {FC} from 'react'
import style from '@components/contacts/contactList/style.module.css'
import Member from "./Member"
import {Buttons} from "@components/buttons"
import {IContact, IDropDownList} from "@appTypes"

interface ContactListProps {
    members: IContact[],
    text?: string,
    dropList: (user_id: string) => IDropDownList[]
}

const MembersList: FC<ContactListProps> = ({members, text, dropList}) => {
    return (
        <section className={style.ContactListContainer}>
            {text && <p>{text}</p>}
            {members.map(member =>
                <Buttons.ContactButton key={member.user_id}>
                    <Member contact={member} dropList={dropList(member.user_id)}/>
                </Buttons.ContactButton>
            )}
        </section>
    )
}

export default MembersList