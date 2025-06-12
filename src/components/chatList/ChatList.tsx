import {memo, useEffect} from 'react'
import {ChatBlock} from "./"
import UserService from '../../service/UserService'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import style from './style.module.css'
import {setMessengers} from "@store/reducers/liveUpdatesReducer";

const ChatList = memo(() => {
    const user_id = useAppSelector(state => state.user.userId)
    const messengers = useAppSelector(state => state.live.messengers)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const constructor = new AbortController()
        const signal = constructor.signal

        const handleMessengerList = async () => {
            try {
                const messengers = await UserService.fetchMessengersList(user_id, signal)

                dispatch(setMessengers(messengers.data))
            } catch (e) {
                console.error(e)
            }
        }

        handleMessengerList()
    }, [user_id])

    return (
        <ul className={style.ChatList}>
            {messengers.length &&
                messengers.map(messenger =>
                    <ChatBlock messenger={messenger} key={messenger.messenger_id}/>
                )
            }
        </ul>
    )
})

export default ChatList