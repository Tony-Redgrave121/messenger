import React, {Dispatch, FC, SetStateAction, useRef} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineUserPlus, HiOutlineXMark} from "react-icons/hi2";
import useSearch from "@hooks/useSearch";
import {IContact} from "@appTypes";
import {SearchBlock} from "@components/searchBlock";
import {ContactList} from "@components/contacts";
import NoResult from "@components/noResult/NoResult";

interface IPopupInputBlock {
    handleCancel: () => void,
    moderators: IContact[],
    members: IContact[],
    setMembers: Dispatch<SetStateAction<IContact[]>>
}

const PopupEditMembers: FC<IPopupInputBlock> = ({handleCancel, moderators, members, setMembers}) => {
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(moderators, 'user_name')

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <p>Add moderators</p>
                </span>
            </div>
            <div className={style.SearchBlock}>
                <SearchBlock foo={handleInput} ref={searchRef}/>
                {filteredArr.length > 0 ?
                    <ContactList contacts={filteredArr} text='Members' childrenFront={<HiOutlineUserPlus/>}/>
                    :
                    <NoResult filter={filter}/>
                }
            </div>
        </>
    )
}

export default PopupEditMembers