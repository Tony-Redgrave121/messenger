import React, {memo, useEffect, useState} from 'react'
import ChatBlock from "./chatBlock/ChatBlock";
import UserService from '../../service/UserService'
import {useAppSelector} from "../../utils/hooks/useRedux";
import IMessengersListResponse from "../../utils/types/IMessengersListResponse";

const ChatList = memo(() => {
    const [messengerList, setMessengerList] = useState<IMessengersListResponse[]>()
    const user_id = useAppSelector(state => state.user.userId)

    useEffect(() => {
        const handleMessengerList = async () => {
            try {
                await UserService.fetchMessengersList(user_id)
                    .then(data => setMessengerList(data.data))
                    .catch(error => console.log(error))
            } catch (e) {
                console.log(e)
            }

            return true
        }

        handleMessengerList().catch()
    }, [user_id])

    return (
        <ul>
            {messengerList &&
                messengerList.map(chat => <ChatBlock messenger={chat} key={chat.messenger_id}/>)
            }
        </ul>
    )
})

export default ChatList