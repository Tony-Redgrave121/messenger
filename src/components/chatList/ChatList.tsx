import React, {memo, useEffect, useState} from 'react'
import ChatBlock from "./chatBlock/ChatBlock";
import UserService from '../../service/UserService'
import {useAppSelector} from "../../utils/hooks/useRedux";
import IMessengerResponse from "../../utils/types/IMessengerResponse";

const ChatList = memo(() => {
    const [messengerList, setMessengerList] = useState<IMessengerResponse[]>([])
    const user_id = useAppSelector(state => state.user.userId)

    useEffect(() => {
        const handleMessengerList = async () => {
            try {
                const list = await UserService.fetchMessengers(user_id)

                if (list.data) setMessengerList(list.data)
            } catch (e) {}
        }

        handleMessengerList().catch()
    }, [user_id])

    console.log(messengerList)

    return (
        <ul>
            {
                messengerList.map(chat =>
                    <ChatBlock messenger={chat} key={chat.messenger_id}/>
                )
            }
        </ul>
    )
})

export default ChatList