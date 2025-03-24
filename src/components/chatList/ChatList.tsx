import React, {memo, useEffect, useState} from 'react'
import ChatBlock from "./chatBlock/ChatBlock";
import UserService from '../../service/UserService'
import {useAppSelector} from "../../utils/hooks/useRedux";
import style from './style.module.css'
import {useMessengerWS} from "../../utils/hooks/useMessengerWS";
import IMessengersListResponse from "../../utils/types/IMessengersListResponse";

const ChatList = memo(() => {
    const user_id = useAppSelector(state => state.user.userId)
    const newMessenger = useAppSelector(state => state.app.newMessenger)

    const [messengersList, setMessengersList] = useState<IMessengersListResponse[]>([])
    useMessengerWS()

    useEffect(() => {
        const constructor = new AbortController()

        const handleMessengerList = async () => {
            const messengers = await UserService.fetchMessengersList(user_id, constructor.signal)

            setMessengersList(messengers.data)
        }

        handleMessengerList().catch(error => console.log(error))
    }, [user_id])

    useEffect(() => {
        if (newMessenger) {
            setMessengersList(prev => {
                const exists = prev.find(messenger => messenger.messenger_id === newMessenger.messenger_id)
                return exists ? prev : [...prev, newMessenger]
            })
        }
    }, [newMessenger])

    return (
        <ul className={style.ChatList}>
            {messengersList.length > 0 &&
                messengersList.map(chat => <ChatBlock messenger={chat} key={chat.messenger_id}/>)
            }
        </ul>
    )
})

export default ChatList