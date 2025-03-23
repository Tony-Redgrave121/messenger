import React, {memo, useEffect, useState} from 'react'
import ChatBlock from "./chatBlock/ChatBlock";
import UserService from '../../service/UserService'
import {useAppSelector} from "../../utils/hooks/useRedux";
import style from './style.module.css'
import {useWebSocket} from "../../utils/hooks/useWebSocket";

const ChatList = memo(() => {
    const user_id = useAppSelector(state => state.user.userId)
    const {
        socketRef,
        messengerList,
        setMessengerList,
    } = useWebSocket()
    
    useEffect(() => {
        const constructor = new AbortController()

        const handleMessengerList = async () => {
            const messengers = await UserService.fetchMessengersList(user_id, constructor.signal)

            setMessengerList(messengers.data)
        }

        handleMessengerList().catch(error => console.log(error))
    }, [setMessengerList, user_id])

    return (
        <ul className={style.ChatList}>
            {messengerList.length > 0 &&
                messengerList.map(chat => <ChatBlock messenger={chat} key={chat.messenger_id}/>)
            }
        </ul>
    )
})

export default ChatList