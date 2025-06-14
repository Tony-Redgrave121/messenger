import {useEffect} from "react"
import messengerService from "../service/MessengerService"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {setContacts} from "@store/reducers/liveUpdatesReducer";

const useGetContacts = () => {
    const userId = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        const getContacts = async () => {
            try {
                const contacts = await messengerService.getContacts(userId, signal)

                if (contacts.status === 200) {
                    dispatch(setContacts(contacts.data))
                }
            } catch (error) {
                console.log(error)
            }
        }
        getContacts()

        return () => controller.abort()
    }, [])
}

export default useGetContacts