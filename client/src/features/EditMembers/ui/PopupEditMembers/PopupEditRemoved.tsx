import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {HiOutlineXMark} from "react-icons/hi2";
import {SearchBar} from "@shared/ui/SearchBar";
import {useSearch}from "@shared/lib";
import {NoResult} from "@shared/ui/NoResult";
import {useAppSelector} from "@shared/lib";
import {useParams} from "react-router-dom";
import {useLiveUpdatesWS} from "@entities/Reaction/lib/hooks/useLiveUpdatesWS";
import {useAbortController} from "@shared/lib";
import {DefaultButton} from "@shared/ui/Button";
import {ContactSchema} from "@entities/Contact";
import {ContactList} from "../../../ContactList";
import IMessengerSettings from "@features/EditMessenger/model/types/IMessengerSettings";
import postRemovedApi from "@features/EditMembers/api/postRemovedApi";

interface IPopupEditModeratorsProps {
    handleCancel: () => void,
    members: ContactSchema[],
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
    const [userToRemove, setUserToRemove] = useState<ContactSchema[]>([])
    const owner_id = useAppSelector(state => state.user.userId)

    const socketRef = useLiveUpdatesWS()
    const {messengerId} = useParams()
    const {getSignal} = useAbortController()

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
            const signal = getSignal()

            const newRemovedMember = await postRemovedApi(userId, messengerId, signal)
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
                    <DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </DefaultButton>
                    <p>Removed Users</p>
                </span>
            </div>
            <div className={style.SearchBar}>
                <SearchBar searchRef={searchRef} foo={handleInput}/>
                {filteredArr.length > 0 ?
                    <ContactList contacts={filteredArr} onClick={handleRemoveMember}/> : <NoResult filter={filter}/>
                }
            </div>
        </>
    )
}

export default PopupEditRemoved