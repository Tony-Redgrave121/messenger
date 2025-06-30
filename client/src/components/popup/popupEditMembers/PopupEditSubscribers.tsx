import React, {Dispatch, FC, SetStateAction, useState} from 'react'
import style from './style.module.css'
import {HiOutlineArrowRight, HiOutlineXMark} from "react-icons/hi2";
import {IMessengerSettings} from "@appTypes";
import {AddContacts} from "@components/contacts";
import MessengerSettingsService from "../../../services/MessengerSettingsService";
import {useParams} from "react-router-dom";
import {useLiveUpdatesWS} from "@utils/hooks/useLiveUpdatesWS";
import {useAppSelector} from "../../../rebuild/shared/lib";
import {useAbortController} from "../../../rebuild/shared/lib";
import {CreateButton, DefaultButton} from "../../../rebuild/shared/ui/Button";
import {ContactSchema} from "../../../rebuild/5-entities/Contact";

interface IPopupEditSubscribersProps {
    handleCancel: () => void,
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const PopupEditSubscribers: FC<IPopupEditSubscribersProps> = ({handleCancel, setSettings}) => {
    const [members, setMembers] = useState<ContactSchema[]>([])
    const {messengerId} = useParams()
    const {getSignal} = useAbortController()

    const socketRef = useLiveUpdatesWS()
    const messengers = useAppSelector(state => state.messenger.messengers)
    const userId = useAppSelector(state => state.user.userId)

    const handleAddMembers = async () => {
        if (!messengerId) return
        const signal = getSignal()

        try {
            const membersId = members.map(member => member.user_id)

            const newMembers = await MessengerSettingsService.postContactsMembers(membersId, messengerId, signal)

            if (newMembers.data.message) return

            setSettings(prev => ({
                ...prev,
                members: [...prev.members, ...newMembers.data]
            }))

            if (socketRef?.readyState === WebSocket.OPEN) {
                socketRef.send(JSON.stringify({
                    user_id: userId,
                    method: 'JOIN_TO_MESSENGER',
                    data: {
                        ...messengers.find(messenger => messenger.messenger_id === messengerId),
                        messenger_members: membersId
                    }
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
                    <p>Add Subscribers</p>
                </span>
            </div>
            <div className={style.SearchBar}>
                <AddContacts
                    members={members}
                    setMembers={setMembers}
                />
            </div>
            <CreateButton state={members.length > 0} foo={handleAddMembers}>
                <HiOutlineArrowRight/>
            </CreateButton>
        </>
    )
}

export default PopupEditSubscribers