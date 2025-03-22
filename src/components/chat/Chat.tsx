import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import InputBlock from "../inputBlock/InputBlock"
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message"
import UserService from "../../service/UserService"
import {useAppSelector} from "../../utils/hooks/useRedux"
import {useNavigate, useParams} from "react-router-dom"
import IMessagesResponse from "../../utils/types/IMessagesResponse"
import IMessengerResponse from "../../utils/types/IMessengerResponse"
import ChatHeader from "./chatHeader/ChatHeader"

const Chat = () => {
    const [sidebarState, setSidebarState] = useState(false)
    const [messagesList, setMessagesList] = useState<IMessagesResponse[]>([])
    const [messenger, setMessenger] = useState<IMessengerResponse>()
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)
    const socketRef = useRef<WebSocket | null>(null)

    const {id} = useParams()
    const user = useAppSelector(state => state.user)

    const navigate = useNavigate()

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
    }, [user.userId, id, navigate])

    useEffect(() => {
        refEnd.current?.scrollIntoView({behavior: 'smooth'})
    }, [messagesList])

    useEffect(() => {
        if (socketRef.current) socketRef.current.close()

        socketRef.current = new WebSocket("ws://localhost:5000")
        const socket = socketRef.current

        socket.onopen = () => {
            socket.send(JSON.stringify({
                messenger_id: id,
                user_id: user.userId,
                method: 'CONNECTION'
            }))
        }

        socket.onmessage = (event) => {
            let message = JSON.parse(event.data)

            switch (message.method) {
                case 'CONNECTION':
                    break
                case 'POST_MESSAGE':
                    setMessagesList(prev => [...prev, message.data])
                    break
                case 'REMOVE_MESSAGE':
                    setMessagesList(prev => prev.filter(msg => msg.message_id !== message.data))
                    break
                default:
                    break
            }
        }

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error)
        }

        return () => socket.close()
    }, [id, user.userId])

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