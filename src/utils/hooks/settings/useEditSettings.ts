import {Dispatch, SetStateAction, useState} from "react";
import {useParams} from "react-router-dom";
import MessengerService from "@service/MessengerService";
import {IMessengerSettings} from "@appTypes";
import {useLiveUpdatesWS} from "@utils/hooks/useLiveUpdatesWS";
import {useAppSelector} from "@hooks/useRedux";

const useEditSettings = (
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
) => {
    const {messengerId} = useParams()
    const [popup, setPopup] = useState(false)
    const socketRef = useLiveUpdatesWS()
    const messengers = useAppSelector(state => state.live.messengers)

    const handleCancel = () => {
        setPopup(false)
        setTimeout(() => setPopup(false), 300)
    }

    const dismissModerator = async (userId: string) => {
        if (!messengerId) return

        try {
            const newModerators = await MessengerService.putMessengerModerator('member', userId, messengerId)

            if (newModerators.data.message) return

            setSettings(prev => ({
                ...prev,
                moderators: [...prev.moderators.filter(moderator =>
                    moderator.member_id !== newModerators.data.member_id
                )]
            }))

            handleCancel()
        } catch (error) {
            console.log(error)
        }
    }

    const addToGroup = async (userId: string) => {
        if (!messengerId) return

        try {
            const newMembers = await MessengerService.postMember(userId, messengerId)
            if (newMembers.data.message) return

            setSettings(prev => ({
                ...prev,
                members: [...prev.members, newMembers.data]
            }))

            setSettings(prev => ({
                ...prev,
                removed_users: [...prev.removed_users.filter(({user}) => user.user_id !== userId)]
            }))

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    user_id: userId,
                    method: 'JOIN_TO_MESSENGER',
                    data: {
                        ...messengers.find(messenger => messenger.messenger_id === messengerId),
                        messenger_members: [userId]
                    }
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteFromRemoved = async (userId: string) => {
        if (!messengerId) return

        try {
            const deletedRemoved = await MessengerService.deleteRemoved(userId, messengerId)

            if (deletedRemoved.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    removed_users: [...prev.removed_users.filter(({user}) => user.user_id !== userId)]
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteFromGroup = async (userId: string) => {
        if (!messengerId) return

        try {
            const deletedMember = await MessengerService.deleteMember(userId, messengerId)

            if (deletedMember.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    members: [...prev.members.filter(({user}) => user.user_id !== userId)]
                }))

                setSettings(prev => ({
                    ...prev,
                    moderators: [...prev.moderators.filter(({user}) => user.user_id !== userId)]
                }))

                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        user_id: userId,
                        method: 'REMOVE_FROM_MESSENGER',
                        data: messengerId
                    }))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {
        popup,
        setPopup,
        handleCancel,
        dismissModerator,
        addToGroup,
        deleteFromRemoved,
        deleteFromGroup
    }
}

export default useEditSettings