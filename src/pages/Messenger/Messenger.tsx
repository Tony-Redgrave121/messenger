import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {InputBlock} from "@components/inputBlock"
import {RightSidebar} from "@components/sidebar"
import {Message} from "./message"
import UserService from "@service/UserService"
import {useAppSelector} from "@hooks/useRedux"
import {useNavigate, useParams} from "react-router-dom"
import {IMessagesResponse, IAdaptMessenger} from "@appTypes"
import MessengerHeader from "./messengerHeader/MessengerHeader"
import {useMessageWS} from "@utils/hooks/useMessageWS";
import checkRights from "@utils/logic/checkRights";

const InitialMessenger: IAdaptMessenger = {
    id: '',
    name: '',
    image: '',
    desc: '',
    type: 'chat',
    members: [],
    members_count: 0,
    last_seen: new Date(),
}

const types = ['chat', 'channel', 'group']

const Messenger= () => {
    const [sidebarState, setSidebarState] = useState(false)
    const [reply, setReply] = useState<IMessagesResponse | null>(null)
    const [messenger, setMessenger] = useState<IAdaptMessenger>(InitialMessenger)

    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const {id, type} = useParams()
    const user = useAppSelector(state => state.user)
    const navigate = useNavigate()

    const {
        socketRef,
        messagesList,
        setMessagesList,
    } = useMessageWS()

    useEffect(() => {
        if (!id || !type) return

        if (!types.includes(type)) {
            navigate("/")
            return
        }

        const controller = new AbortController()
        const signal = controller.signal

        const handleMessageList = async () => {
            setMessagesList([])

            try {
                const [messenger, messages] = await Promise.all([
                    UserService.fetchMessenger(user.userId, type, id, signal),
                    UserService.fetchMessages(user.userId, type, id, signal)
                ])

                if (messenger.status === 200 && messages.status === 200) {
                    const messengerData = messenger.data
                    let adaptMessenger = InitialMessenger

                    if ("user_id" in messengerData) {
                        adaptMessenger = {
                            id: messengerData.user_id,
                            name: messengerData.user_name,
                            image: messengerData.user_img,
                            desc: messengerData.user_bio,
                            type: 'chat',
                            last_seen: messengerData.user_last_seen,
                        }
                    } else if ("messenger_id" in messengerData) {
                        adaptMessenger = {
                            id: messengerData.messenger_id,
                            name: messengerData.messenger_name,
                            image: messengerData.messenger_image,
                            desc: messengerData.messenger_desc,
                            type: messengerData.messenger_type,
                            members: messengerData.user_member,
                            members_count: messengerData.members_count,
                        }
                    }

                    if (adaptMessenger.id !== '') {
                        setMessenger(adaptMessenger)
                        setMessagesList(messages.data)
                    }
                } else navigate('/')
            } catch (error) {
                console.log(error)
            }
        }

        handleMessageList().catch(error => console.log(error))

        return () => controller.abort()
    }, [user.userId, id, navigate, setMessagesList])

    useEffect(() => {
        const timeout = setTimeout(() => refEnd.current?.scrollIntoView({behavior: 'smooth'}), 300)
        return () => clearTimeout(timeout)
    }, [messagesList])

    return (
        <>
            {messenger &&
                <>
                    <div className={style.Wrapper}>
                        <div className={style.ChatContainer}>
                            <MessengerHeader messenger={messenger} setSidebarState={setSidebarState}/>
                            <section className={style.MessageBlock} key={id}>
                                {messagesList.map(message =>
                                    <Message
                                        message={message}
                                        messenger={messenger}
                                        key={message.message_id}
                                        setReply={setReply}
                                        socketRef={socketRef}
                                    />
                                )}
                                <div ref={refEnd}/>
                            </section>
                            {(messenger.type === "channel" ? checkRights(messenger.members!, user.userId) : true) &&
                                <InputBlock setReply={setReply} reply={reply} socketRef={socketRef}/>
                            }
                        </div>
                    </div>
                    <RightSidebar
                        entity={messenger}
                        setEntity={setMessenger}
                        ref={refRightSidebar}
                        state={sidebarState}
                        setState={setSidebarState}
                        key={messenger.id}
                    />
                </>
            }
        </>
    )
}

export default Messenger