import {lazy, memo, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from "../../../../shared/lib"
import style from './style.module.css'
import {setMessengers} from "../../../../5-entities/Messenger/model/slice/messengerSlice";
import {useAbortController} from "../../../../shared/lib";
import chatListApi from "../../api/chatListApi";

const ChatBlock = lazy(() => import("../СhatBlock/ChatBlock"))

const ChatList = memo(() => {
    const user_id = useAppSelector(state => state.user.userId)
    const messengers = useAppSelector(state => state.messenger.messengers)
    const dispatch = useAppDispatch()
    const {getSignal} = useAbortController()

    useEffect(() => {
        const signal = getSignal()

        const handleMessengerList = async () => {
            try {
                const messengers = await chatListApi(user_id, signal)
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