import {useEffect, useState} from "react"
import messengerService from "../../service/MessengerService"
import {useAppSelector} from "./useRedux"
import IContact from "../types/IContact";

const useGetContacts = () => {
    const userId = useAppSelector(state => state.user.userId)
    const [contacts, setContacts] = useState<IContact[]>([])

    useEffect(() => {
        const controller = new AbortController()

        const getContacts = async () => {
            const contacts = await messengerService.getContacts(userId, controller.signal) as any
            const payload = contacts.payload

            if (payload && payload.message) return console.log(payload.message)
            setContacts(contacts.data)
        }

        getContacts().catch(error => console.log(error))

        return () => controller.abort()
    }, [userId])

    return {
        setContacts,
        contacts
    }
}

export default useGetContacts