import React, {Dispatch, FC, SetStateAction} from 'react'
import {Contact} from "../";

import style from "./style.module.css";
import {LoadFile} from "@components/loadFile";
import {useSearch}from "../../../rebuild/shared/lib";
import {NoResult} from "../../../rebuild/shared/ui/NoResult";
import {useAppSelector} from "../../../rebuild/shared/lib";
import {Checkbox} from "../../../rebuild/shared/ui/Input";
import {ContactSchema} from "../../../rebuild/5-entities/Contact";

interface ICheckboxContactProps {
    members: ContactSchema[],
    setMembers: Dispatch<SetStateAction<ContactSchema[]>>
}

const AddContacts: FC<ICheckboxContactProps> = ({members, setMembers}) => {
    const contacts = useAppSelector(state => state.contact.contacts)
    const {filteredArr, handleInput, filter} = useSearch<ContactSchema, 'user_name'>(contacts, 'user_name')

    const handleCheck = (contact: ContactSchema, members: ContactSchema[]) => {
        return members.some(el => el.user_id === contact.user_id)
    }

    const handleAddMember = (contact: ContactSchema) => {
        setMembers((prev) => {
            if (handleCheck(contact, prev)) return [...prev.filter(el => el.user_id !== contact.user_id)]
            else return [...prev, contact]
        })
    }

    return (
        <div className={style.ContactsContainer}>
            <div className={style.MemberContainer}>
                {members.map(contact =>
                    <button key={contact.user_id} className={style.RemoveMemberButton} onClick={() => handleAddMember(contact)}>
                        <LoadFile imagePath={contact.user_img ? `users/${contact.user_id}/${contact.user_img}` : ''} imageTitle={contact.user_name}/>
                        <h4>{contact.user_name}</h4>
                    </button>
                )}
                <input type="text" placeholder="Add people..." onChange={handleInput}/>
            </div>
            {filteredArr.length > 0 ?
                filteredArr.map((contact) =>
                    <Checkbox key={contact.user_id} foo={() => handleAddMember(contact)} state={handleCheck(contact, members)}>
                        <Contact contact={contact}/>
                    </Checkbox>
                ) : <NoResult filter={filter}/>
            }
        </div>
    )
}

export default AddContacts