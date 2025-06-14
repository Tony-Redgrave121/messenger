import React, {Dispatch, FC, SetStateAction, useState} from 'react'
import style from './style.module.css'
import {Buttons} from "@components/buttons";
import {HiOutlineArrowRight, HiOutlineXMark} from "react-icons/hi2";
import {IContact, IMessengerSettings} from "@appTypes";
import {AddContacts} from "@components/contacts";
import MessengerService from "@service/MessengerService";
import {useParams} from "react-router-dom";
import {useLiveUpdatesWS} from "@utils/hooks/useLiveUpdatesWS";
import {useAppSelector} from "@hooks/useRedux";

interface IPopupEditSubscribersProps {
    handleCancel: () => void,
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const PopupEditSubscribers: FC<IPopupEditSubscribersProps> = ({handleCancel, setSettings}) => {
    const [members, setMembers] = useState<IContact[]>([])
    const {messengerId} = useParams()
    const socketRef = useLiveUpdatesWS()
    const messengers = useAppSelector(state => state.live.messengers)
    const userId = useAppSelector(state => state.user.userId)

    const handleAddMembers = async () => {
        if (!messengerId) return

        try {
            const membersId = members.map(member => member.user_id)
            const newMembers = await MessengerService.postContactsMembers(membersId, messengerId)

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
                />
            </div>
            <Buttons.CreateButton state={members.length > 0} foo={handleAddMembers}>
                <HiOutlineArrowRight/>
            </Buttons.CreateButton>
        </>
    )
}

export default PopupEditSubscribers