import React, {Dispatch, FC, SetStateAction} from 'react'
import style from "./style.module.css";
import {LoadFile} from "@shared/ui/LoadFile";
import {useSearch}from "@shared/lib";
import {NoResult} from "@shared/ui/NoResult";
import {useAppSelector} from "@shared/lib";
import {Checkbox} from "@shared/ui/Input";
import {Contact, ContactSchema} from "@entities/Contact";

interface ICheckboxContactProps {
    members: ContactSchema[],
    setMembers: Dispatch<SetStateAction<ContactSchema[]>>
}

const AddContact: FC<ICheckboxContactProps> = ({members, setMembers}) => {
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

export default AddContact