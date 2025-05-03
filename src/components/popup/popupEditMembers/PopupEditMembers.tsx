import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineXMark} from "react-icons/hi2";
import {IContact} from "@appTypes";
import {SearchBlock} from "@components/searchBlock";
import useSearch from "@hooks/useSearch";
import {ContactList} from "@components/contacts";
import NoResult from "@components/noResult/NoResult";
import {useAppSelector} from "@hooks/useRedux";

interface IPopupEditModeratorsProps {
    handleCancel: () => void,
    moderators: IContact[],
    members: IContact[],
    setMembers: Dispatch<SetStateAction<IContact[]>>,
    title: string
}

const PopupEditMembers: FC<IPopupEditModeratorsProps> = ({handleCancel, moderators, members, setMembers, title}) => {
    const [unrated, setUnrated] = useState<IContact[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const user_id = useAppSelector(state => state.user.userId)

    useEffect(() => {
        setUnrated(members.filter(member => moderators.some(moderator => moderator.user_id !== member.user_id && member.user_id !== user_id)))
    }, [members, moderators, user_id])

    const {
        filteredArr,
        handleInput,
        filter
    } = useSearch(unrated, 'user_name')

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
                <SearchBlock ref={searchRef} foo={handleInput}/>
                {filteredArr.length > 0 ?
                    <ContactList contacts={filteredArr}/> : <NoResult filter={filter}/>
                }
            </div>
        </>
    )
}

export default PopupEditMembers