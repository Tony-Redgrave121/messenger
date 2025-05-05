import React, {Dispatch, FC, SetStateAction} from 'react'
import {Buttons} from "@components/buttons";
import {Contact} from "../";
import {IContact} from "@appTypes";
import style from "./style.module.css";
import {LoadFile} from "@components/loadFile";
import useSearch from "@hooks/useSearch";
import NoResult from "@components/noResult/NoResult";

interface ICheckboxContactProps {
    members: IContact[],
    contacts: IContact[],
    setMembers: Dispatch<SetStateAction<IContact[]>>
    onClick: () => void
}

const AddContacts: FC<ICheckboxContactProps> = ({members, contacts, setMembers, onClick}) => {
    const {filteredArr, handleInput, filter} = useSearch(contacts, 'user_name')

    const handleCheck = (contact: IContact, members: IContact[]) => {
        return members.some(el => el.user_id === contact.user_id)
    }

    const handleAddMember = (contact: IContact) => {
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
                    <Buttons.Checkbox key={contact.user_id} foo={() => handleAddMember(contact)} state={handleCheck(contact, members)}>
                        <Contact contact={contact} onClick={() => onClick()}/>
                    </Buttons.Checkbox>
                ) : <NoResult filter={filter}/>
            }
        </div>
    )
}

export default AddContacts