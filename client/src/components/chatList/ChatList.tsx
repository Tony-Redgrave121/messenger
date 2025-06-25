import {lazy, memo, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import style from './style.module.css'
import {setMessengers} from "@store/reducers/liveUpdatesReducer";
import MessengerManagementService from "@service/MessengerManagementService";
import {useAbortController} from "@hooks/useAbortController";
const ChatBlock = lazy(() => import("./chatBlock/ChatBlock"))

const ChatList = memo(() => {
    const user_id = useAppSelector(state => state.user.userId)
    const messengers = useAppSelector(state => state.live.messengers)
    const dispatch = useAppDispatch()
    const {getSignal} = useAbortController()

    useEffect(() => {
        const signal = getSignal()

        const handleMessengerList = async () => {
            try {
                const messengers = await MessengerManagementService.fetchMessengersList(user_id, signal)
                dispatch(setMessengers(messengers.data))
            } catch (e) {
                console.error(e)
            }
        }

        handleMessengerList()
    }, [user_id])

    return (
        <ul className={style.ChatList}>
            {messengers.length > 0 &&
                messengers.map(messenger =>
                    <ChatBlock messenger={messenger} key={messenger.messenger_id}/>
                )
            }
        </ul>
    )
})

export default ChatList