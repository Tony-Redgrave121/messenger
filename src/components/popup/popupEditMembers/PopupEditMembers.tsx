import React, {Dispatch, FC, SetStateAction} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineXMark} from "react-icons/hi2";
import {IContact} from "@appTypes";
import {AddContacts} from "@components/contacts";

interface IPopupInputBlock {
    handleCancel: () => void,
    moderators: IContact[],
    members: IContact[],
    setMembers: Dispatch<SetStateAction<IContact[]>>,
    title: string
}

const PopupEditMembers: FC<IPopupInputBlock> = ({handleCancel, moderators, members, setMembers, title}) => {
    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <p>{title}</p>
                </span>
            </div>
            <div className={style.SearchBlock}>
                <AddContacts
                    members={moderators}
                    setMembers={setMembers}
                    contacts={members}
                />
            </div>
        </>
    )
}

export default PopupEditMembers