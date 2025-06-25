import {useEffect} from "react"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {setContacts} from "@store/reducers/liveUpdatesReducer";
import UserService from "@service/UserService";
import {useAbortController} from "@hooks/useAbortController";

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