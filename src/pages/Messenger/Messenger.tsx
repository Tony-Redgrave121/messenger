import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {InputBlock} from "@components/inputBlock"
import {RightSidebar} from "@components/sidebar"
import {Message} from "./message"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {useParams} from "react-router-dom"
import {IMessagesResponse} from "@appTypes"
import MessengerHeader from "./messengerHeader/MessengerHeader"
import checkRights from "@utils/logic/checkRights";
import MessengerService from "@service/MessengerService";
import isMember from "@utils/logic/isMember";
import useFetchInitialData from "@hooks/useFetchInitialData";
import {addMessenger, clearNotification} from "@store/reducers/liveUpdatesReducer";

const Messenger = () => {
    const [sidebarState, setSidebarState] = useState(false)
    const [buttonState, setButtonState] = useState(false)
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const {messengerId} = useParams()
    const userId = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()

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

        const adaptMessenger = () => {
            const lastMessage = messagesList[messagesList.length - 1]

            dispatch(addMessenger({
                messenger_id: messenger.id,
                messenger_name: messenger.name,
                messenger_image: messenger.image,
                messenger_type: messenger.type,
                messages: lastMessage ? [{
                    message_date: lastMessage.message_date,
                    message_text: lastMessage.message_text
                }] : []
            }))

            return setButtonState(true)
        }

        try {
            if (messenger.type === 'chat') adaptMessenger()
            else {
                const newMembers = await MessengerService.postContactsMembers([userId], messengerId)

                if (newMembers.status === 200) adaptMessenger()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if ((messenger.type === 'chat' && messagesList.length > 0) || isMember(messenger.members!, userId)) {
            setButtonState(true)
        } else setButtonState(false)
    }, [messenger])

    useEffect(() => {
        if (messengerId) dispatch(clearNotification(messengerId))
    }, [dispatch, messengerId])

    const getMembers = () => {
        if (!messengerId) return []

        if (messenger.type === 'chat') return [messengerId, userId]
        return messenger.members?.map(member => member.user.user_id)
    }

    return (
        <>
            {messenger &&
                <>
                    <div className={style.MessengerContainer}>
                        <MessengerHeader messenger={messenger} setSidebarState={setSidebarState}/>
                        <section className={style.MessageBlock} key={messengerId}>
                            {messagesList.map(message =>
                                <Message
                                    message={message}
                                    messenger={messenger}
                                    key={message.message_id}
                                    setReply={setReply}
                                    socketRef={socketRef}
                                    reactions={reactions}
                                />
                            )}
                            <div ref={refEnd}/>
                        </section>
                        {buttonState ?
                            (messenger.type === "channel" ? checkRights(messenger.members!, userId) : true) &&
                            <InputBlock
                                setReply={setReply}
                                reply={reply}
                                socketRef={socketRef}
                                members={getMembers()}
                            /> :
                            <button className={style.SubscribeButton} onClick={subscribeToMessenger}>
                                {messenger.type === 'chat' ? 'Start conversation' : 'Subscribe'}
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