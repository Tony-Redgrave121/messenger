import {Dispatch, SetStateAction, useState} from "react";
import {useParams} from "react-router-dom";
import MessengerService from "@service/MessengerService";
import {IMessengerSettings} from "@appTypes";

const useEditSettings = (
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
) => {
    const {id} = useParams()
    const [popup, setPopup] = useState(false)

    const handleCancel = () => {
        setPopup(false)
        setTimeout(() => setPopup(false), 300)
    }

    const dismissModerator = async (user_id: string) => {
        if (!id) return

        try {
            const newModerators = await MessengerService.putMessengerModerator('member', user_id, id)

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

    const addToGroup = async (user_id: string) => {
        if (!id) return

        try {
            const newMembers = await MessengerService.postMember(user_id, id)
            if (newMembers.data.message) return

            setSettings(prev => ({
                ...prev,
                members: [...prev.members, newMembers.data]
            }))

            setSettings(prev => ({
                ...prev,
                removed_users: [...prev.removed_users.filter(({user}) => user.user_id !== user_id)]
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const deleteFromRemoved = async (user_id: string) => {
        if (!id) return

        try {
            const deletedRemoved = await MessengerService.deleteRemoved(user_id, id)

            if (deletedRemoved.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    removed_users: [...prev.removed_users.filter(({user}) => user.user_id !== user_id)]
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteFromGroup = async (user_id: string) => {
        if (!id) return

        try {
            const deletedMember = await MessengerService.deleteMember(user_id, id)

            if (deletedMember.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    members: [...prev.members.filter(({user}) => user.user_id !== user_id)]
                }))

                setSettings(prev => ({
                    ...prev,
                    moderators: [...prev.moderators.filter(({user}) => user.user_id !== user_id)]
                }))
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