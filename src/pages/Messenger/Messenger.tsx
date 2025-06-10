import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {InputBlock} from "@components/inputBlock"
import {RightSidebar} from "@components/sidebar"
import {Message} from "./message"
import {useAppSelector} from "@hooks/useRedux"
import {useParams} from "react-router-dom"
import {IMessagesResponse} from "@appTypes"
import MessengerHeader from "./messengerHeader/MessengerHeader"
import checkRights from "@utils/logic/checkRights";
import MessengerService from "@service/MessengerService";
import isMember from "@utils/logic/isMember";
import useFetchInitialData from "@hooks/useFetchInitialData";

const Messenger = () => {
    const [sidebarState, setSidebarState] = useState(false)
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const {messengerId} = useParams()
    const user = useAppSelector(state => state.user)

    const {
        messenger,
        setMessenger,
        reactions,
        messagesList,
        socketRef
    } = useFetchInitialData()

    useEffect(() => {
        const timeout = setTimeout(() => refEnd.current?.scrollIntoView({behavior: 'smooth'}), 300)
        return () => clearTimeout(timeout)
    }, [messagesList])

    const subscribeToMessenger = async () => {
        if (!messengerId) return

        try {
            const newMembers = await MessengerService.postContactsMembers([user.userId], messengerId)
            if (newMembers.data.message) return
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {messenger &&
                <>
                    <div className={style.ChatContainer}>
                        <MessengerHeader messenger={messenger} setSidebarState={setSidebarState}/>
                        <section className={style.MessageBlock} key={messengerId}>
                            {messagesList.map(message =>
                                <Message
                                    message={message}
                                    postId={message.message_id}
                                    messenger={messenger}
                                    key={message.message_id}
                                    setReply={setReply}
                                    socketRoom={messengerId}
                                    socketRef={socketRef}
                                    reactions={reactions}
                                />
                            )}
                            <div ref={refEnd}/>
                        </section>
                        {isMember(messenger.members!, user.userId) ?
                            (messenger.type === "channel" ? checkRights(messenger.members!, user.userId) : true) && messengerId &&
                            <InputBlock
                                setReply={setReply}
                                reply={reply}
                                socketRef={socketRef}
                                socketRoom={messengerId}
                            /> :
                            <button className={style.SubscribeButton} onClick={subscribeToMessenger}>
                                Subscribe
                            </button>
                        }
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