import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import InputBlock from "../inputBlock/InputBlock"
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message"
import UserService from "../../service/UserService"
import {useAppSelector} from "../../utils/hooks/useRedux"
import {useNavigate, useParams} from "react-router-dom"
import IMessagesResponse from "../../utils/types/IMessagesResponse"
import ChatHeader from "./chatHeader/ChatHeader"
import {useWebSocket} from "../../utils/hooks/useWebSocket";
import IMessengerResponse from "../../utils/types/IMessengerResponse";

const Chat = () => {
    const [sidebarState, setSidebarState] = useState(false)
    const [reply, setReply] = useState<IMessagesResponse | null>(null)
    const [messenger, setMessenger] = useState<IMessengerResponse>()
    
    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const {id} = useParams()
    const user = useAppSelector(state => state.user)

    const navigate = useNavigate()
    
    const {
        socketRef,
        messagesList,
        setMessagesList,
    } = useWebSocket()
    
    useEffect(() => {
        if (!id) return

        const controller = new AbortController()
        const signal = controller.signal

        const handleMessageList = async () => {
            setMessagesList([])

            try {
                const [messenger, messages] = await Promise.all([
                    UserService.fetchMessenger(user.userId, id, signal),
                    UserService.fetchMessages(user.userId, id, signal)
                ])
                const error = messenger.data as any
                if (error.message) navigate('/')

                setMessenger(messenger.data)
                setMessagesList(messages.data)
            } catch (error) {
                console.log(error)
            }
        }

        handleMessageList().catch(error => console.log(error))

        return () => controller.abort()
    }, [user.userId, id, navigate, setMessagesList])

    useEffect(() => {
        refEnd.current?.scrollIntoView({behavior: 'smooth'})
    }, [messagesList])

    return (
        <>
            {messenger &&
                <>
                    <div className={style.Wrapper}>
                        <div className={style.ChatContainer}>
                            <ChatHeader messenger={messenger} setSidebarState={setSidebarState}/>
                            <div className={style.MessageBlock} key={id}>
                                {messagesList.length > 0 && messagesList.map(message =>
                                    <Message.ChatMessage message={message} key={message.message_id} setReply={setReply} socketRef={socketRef}/>
                                )}
                                <div ref={refEnd}/>
                            </div>
                            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef}/>
                        </div>
                    </div>
                    <RightSidebar entity={messenger} ref={refRightSidebar} state={sidebarState} setState={setSidebarState} key={messenger.messenger_id}/>
                </>
            }
        </>
    )
}

export default Chat