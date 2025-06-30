import React, {FC, ReactNode, useState} from 'react';
import style from '@components/contacts/style.module.css'

import {LoadFile} from "@components/loadFile";
import {DropDown} from "../../../../../../../shared/ui/DropDown";
import {useAppSelector, getDate, contextMenu} from "../../../../../../../shared/lib";
import {DropDownList} from "../../../../../../../shared/types";
import {ContactSchema} from "../../../../../../../5-entities/Contact";

interface IContactsProps {
    contact: ContactSchema,
    children?: ReactNode,
    dropList: DropDownList[]
}

const Member: FC<IContactsProps> = ({contact, children, dropList}) => {
    const [contextMenuState, setContextMenuState] = useState(false)
    const [position, setPosition] = useState({x: 0, y: 0})
    const user_id = useAppSelector(state => state.user.userId)

    return (
        <div className={style.ContactBlock} onContextMenu={(event) => user_id !== contact.user_id && contextMenu({
            event,
            setPosition,
            setContextMenuState,
            height: 45
        })}>
            {children}
            <span>
                <LoadFile imagePath={contact.user_img ? `users/${contact.user_id}/${contact.user_img}` : ''} imageTitle={contact.user_name}/>
            </span>
            <div className={style.ContactInfo}>
                <h4>{contact.user_name}</h4>
                <p>{getDate(contact.user_last_seen)}</p>
            </div>
            <DropDown list={dropList} state={contextMenuState} setState={setContextMenuState} position={position}/>
        </div>
    )
}

export default Member