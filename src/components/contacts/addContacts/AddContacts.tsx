import React from 'react'
import {Buttons} from "@components/buttons";
import {Contact} from "../index";
import IContact from "../../../types/IContact";
import style from "./style.module.css";
import {HiMagnifyingGlass} from "react-icons/hi2";
import LoadFile from "../../loadFile/LoadFile";
import useSearch from "@hooks/useSearch";

interface ICheckboxContactProps {
    members: IContact[],
    contacts: IContact[],
    setMembers: React.Dispatch<React.SetStateAction<IContact[]>>
}

const AddContacts: React.FC<ICheckboxContactProps> = ({members, contacts, setMembers}) => {
    const {filteredContacts, handleInput, filter} = useSearch(contacts)

    const handleAddMember = (contact: IContact) => {
        setMembers((prev) => {
            if (prev.includes(contact)) return [...prev.filter(el => el !== contact)]
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
            {filteredContacts.length > 0 ?
                filteredContacts.map((contact) =>
                    <Buttons.Checkbox key={contact.user_id} foo={() => handleAddMember(contact)} state={members.includes(contact)}>
                        <Contact contact={contact}/>
                    </Buttons.Checkbox>
                ) :
                <div className={style.NoResultContainer}>
                    <HiMagnifyingGlass/>
                    <h1>No Results</h1>
                    <p>There were no results for "{filter}".<br/> Try a new search.</p>
                </div>
            }
        </div>
    )
}

export default AddContacts