import {useEffect} from "react"
import {useAppDispatch, useAppSelector} from "../../rebuild/shared/lib"
import {setContacts} from "../../rebuild/5-entities/Contact/model/slice/contactSlice";
import UserService from "../../services/UserService";
import {useAbortController} from "../../rebuild/shared/lib";

const useGetContacts = () => {
    const userId = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()
    const {getSignal} = useAbortController()

    useEffect(() => {
        const signal = getSignal()

        const getContacts = async () => {
            try {
                const contacts = await UserService.getContacts(userId, signal)

                if (contacts.status === 200) {
                    dispatch(setContacts(contacts.data))
                }
            } catch (error) {
                console.log(error)
            }
        }
        getContacts()
    }, [])
}

export default useGetContacts