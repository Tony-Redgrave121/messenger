import React, {useMemo, useState} from 'react'
import Buttons from "../../buttons/Buttons";
import Contact from "../Contact";
import IContact from "../../../utils/types/IContact";
import style from "./style.module.css";
import {HiMagnifyingGlass} from "react-icons/hi2";
import debounce from "debounce";
import LoadFile from "../../loadFile/LoadFile";

interface ICheckboxContactProps {
    members: IContact[],
    contacts: IContact[],
    setMembers: React.Dispatch<React.SetStateAction<IContact[]>>
}

const AddContacts: React.FC<ICheckboxContactProps> = ({members, contacts, setMembers}) => {
    const [filteredContacts, setFilteredContacts] = useState<IContact[]>(contacts)
    const [filter, setFilter] = useState('')

    const handleAddMember = (contact: IContact) => {
        setMembers((prev) => {
            if (prev.includes(contact)) return [...prev.filter(el => el !== contact)]
            else return [...prev, contact]
        })
    }

    const searchDebounce = useMemo(() =>
        debounce((query: string) => (
            setFilteredContacts(contacts.filter(el => el.contact_name.toLowerCase().includes(query)))
        ), 200), [contacts]
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase()
        setFilter(query)

        searchDebounce(query)
    }

    return (
        <div className={style.ContactsContainer}>
            <div className={style.MemberContainer}>
                {members.map(contact =>
                    <button key={contact.contact_id} className={style.RemoveMemberButton} onClick={() => handleAddMember(contact)}>
                        <LoadFile imagePath={contact.contact_image ? `users/${contact.contact_id}/${contact.contact_image}` : ''} imageTitle={contact.contact_name}/>
                        <h4>{contact.contact_name}</h4>
                    </button>
                )}
                <input type="text" placeholder="Add people..." onChange={handleInput}/>
            </div>
            {filteredContacts.length > 0 ?
                filteredContacts.map((contact) =>
                    <Buttons.Checkbox key={contact.contact_id} foo={() => handleAddMember(contact)} state={members.includes(contact)}>
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