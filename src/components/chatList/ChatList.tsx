import React, {memo, useEffect, useState} from 'react'
import ChatBlock from "./chatBlock/ChatBlock";
import UserService from '../../service/UserService'
import {useAppSelector} from "../../utils/hooks/useRedux";
import IMessengersListResponse from "../../utils/types/IMessengersListResponse";
import style from './style.module.css'

const ChatList = memo(() => {
    const [messengerList, setMessengerList] = useState<IMessengersListResponse[]>()
    const user_id = useAppSelector(state => state.user.userId)

    useEffect(() => {
        const constructor = new AbortController()

        const handleMessengerList = async () => {
            const messengers = await UserService.fetchMessengersList(user_id, constructor.signal)

            setMessengerList(messengers.data)
        }

        handleMessengerList().catch(error => console.log(error))
    }, [user_id])

    return (
        <ul className={style.ChatList}>
            {messengerList &&
                messengerList.map(chat => <ChatBlock messenger={chat} key={chat.messenger_id}/>)
            }
        </ul>
    )
})

export default ChatList