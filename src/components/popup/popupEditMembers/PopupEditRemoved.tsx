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
import {useLiveUpdatesWS} from "@utils/hooks/useLiveUpdatesWS";

interface IPopupEditModeratorsProps {
    handleCancel: () => void,
    members: IContact[],
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const PopupEditRemoved: FC<IPopupEditModeratorsProps> = (
    {
        handleCancel,
        members,
        setSettings,
    }
) => {
    const searchRef = useRef<HTMLDivElement>(null)
    const [userToRemove, setUserToRemove] = useState<IContact[]>([])
    const owner_id = useAppSelector(state => state.user.userId)

    const socketRef = useLiveUpdatesWS()
    const {messengerId} = useParams()

    useEffect(() => {
        setUserToRemove(members.filter(member => member.user_id !== owner_id))
    }, [members, owner_id])
    
    const {
        filteredArr,
        handleInput,
        filter
    } = useSearch(userToRemove, 'user_name')

    const handleRemoveMember = async (userId: string) => {
        if (!messengerId) return

        try {
            const newRemovedMember = await MessengerService.postRemoved(userId, messengerId)
            if (newRemovedMember.data.message) return

            setSettings(prev => ({
                ...prev,
                removed_users: [...prev.removed_users, newRemovedMember.data],
            }))

            setSettings(prev => ({
                ...prev,
                members: [...prev.members.filter(member => member.user.user_id !== newRemovedMember.data.user.user_id)],
            }))

            if (socketRef?.readyState === WebSocket.OPEN) {
                socketRef.send(JSON.stringify({
                    user_id: userId,
                    method: 'REMOVE_FROM_MESSENGER',
                    data: messengerId
                }))
            }

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
                    <ContactList contacts={filteredArr} onClick={handleRemoveMember}/> : <NoResult filter={filter}/>
                }
            </div>
        </>
    )
}

export default PopupEditRemoved