import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {InputBlock} from "@components/inputBlock"
import {RightSidebar} from "@components/sidebar"
import {Message} from "@components/message"
import UserService from "../../service/UserService"
import {useAppSelector} from "@hooks/useRedux"
import {useNavigate, useParams} from "react-router-dom"
import {IMessagesResponse, IMessengerResponse} from "@appTypes"
import ChatHeader from "./chatHeader/ChatHeader"
import {useMessageWS} from "@utils/hooks/useMessageWS";

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
    } = useMessageWS()
    
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