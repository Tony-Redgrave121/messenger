import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineXMark} from "react-icons/hi2";
import {IContact, IMessengerSettings} from "@appTypes";
import {SearchBlock} from "@components/searchBlock";
import useSearch from "@hooks/useSearch";
import {ContactList} from "@components/contacts";
import NoResult from "@components/noResult/NoResult";
import {useAppSelector} from "@hooks/useRedux";
import {useParams} from "react-router-dom";
import MessengerService from "@service/MessengerService";

interface IPopupEditModeratorsProps {
    handleCancel: () => void,
    moderators: IContact[],
    members: IContact[],
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const PopupEditRemoved: FC<IPopupEditModeratorsProps> = (
    {
        handleCancel,
        moderators,
        members,
        setSettings,
    }
) => {
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

    const {id} = useParams()

    const handleAddRemoved = async (user_id: string) => {
        if (!id) return

        try {
            const newModerators = await MessengerService.postRemoved(user_id, id)

            if (newModerators.data.message) return

            setSettings(prev => ({
                ...prev,
                moderators: [...prev.moderators, newModerators.data],
            }))

            handleCancel()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <p>Removed Users</p>
                </span>
            </div>
            <div className={style.SearchBlock}>
                <SearchBlock ref={searchRef} foo={handleInput}/>
                {filteredArr.length > 0 ?
                    <ContactList contacts={filteredArr} onClick={handleAddRemoved}/> : <NoResult filter={filter}/>
                }
            </div>
        </>
    )
}

export default PopupEditRemoved