import React, {FC, ReactNode, useState} from 'react';
import style from '@components/contacts/style.module.css'
import {IContact, IDropDownList} from "@appTypes";
import {getDate} from "@utils/logic/getDate";
import {LoadFile} from "@components/loadFile";
import {DropDown} from "@components/dropDown";
import handleContextMenu from "@utils/logic/handleContextMenu";

interface IContactsProps {
    contact: IContact,
    children?: ReactNode,
    dropList: IDropDownList[]
}

const Member: FC<IContactsProps> = ({contact, children, dropList}) => {
    const [contextMenu, setContextMenu] = useState(false)
    const [position, setPosition] = useState({x: 0, y: 0})

    return (
        <div className={style.ContactBlock} onContextMenu={(event) => handleContextMenu({
            event,
            setPosition,
            setContextMenu
        })}>
            {children}
            <span>
                <LoadFile imagePath={contact.user_img ? `users/${contact.user_id}/${contact.user_img}` : ''} imageTitle={contact.user_name}/>
            </span>
            <div className={style.ContactInfo}>
                <h4>{contact.user_name}</h4>
                <p>{getDate(contact.user_last_seen)}</p>
            </div>
            <DropDown list={dropList} state={contextMenu} setState={setContextMenu} position={position}/>
        </div>
    )
}

export default Member