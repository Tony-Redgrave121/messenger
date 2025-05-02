import React, {FC, useState} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineArrowRight, HiOutlineXMark} from "react-icons/hi2";
import {IContact} from "@appTypes";
import {AddContacts} from "@components/contacts";
import useGetContacts from "@hooks/useGetContacts";

interface IPopupEditSubscribersProps {
    handleCancel: () => void
}

const PopupEditSubscribers: FC<IPopupEditSubscribersProps> = ({handleCancel}) => {
    const {contacts} = useGetContacts()
    const [members, setMembers] = useState<IContact[]>([])

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <p>Add Subscribers</p>
                </span>
            </div>
            <div className={style.SearchBlock}>
                <AddContacts
                    members={members}
                    setMembers={setMembers}
                    contacts={contacts}
                />
            </div>
            {members.length > 0 &&
                <span className={style.CreateButton}>
                    <Buttons.InterButton foo={() => {
                    }}>
                        <HiOutlineArrowRight/>
                    </Buttons.InterButton>
                </span>
            }
        </>
    )
}

export default PopupEditSubscribers