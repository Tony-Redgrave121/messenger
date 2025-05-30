import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import {InputBlock} from "@components/inputBlock"
import {RightSidebar} from "@components/sidebar"
import {Message} from "./message"
import UserService from "@service/UserService"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {useNavigate, useParams} from "react-router-dom"
import {IMessagesResponse, IAdaptMessenger, ICommentState, IReaction, isServerError} from "@appTypes"
import MessengerHeader from "./messengerHeader/MessengerHeader"
import {useMessageWS} from "@utils/hooks/useMessageWS";
import checkRights from "@utils/logic/checkRights";
import CommentsBlock from "./commentsBlock/CommentsBlock";
import {CSSTransition} from "react-transition-group";
import MessengerService from "@service/MessengerService";
import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";
import isMember from "@utils/logic/isMember";

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
    const [reactions, setReactions] = useState<IReaction[]>([])
    const [messenger, setMessenger] = useState<IAdaptMessenger>(InitialMessenger)

    const [comment, setComment] = useState<ICommentState>({
        comment: null,
        commentState: false
    })

    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const {id, type} = useParams()
    const user = useAppSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        socketRef,
        messagesList,
        setMessagesList,
    } = useMessageWS(id)

    useEffect(() => {
        if (!id || !type) return

        if (!types.includes(type) || !id) {
            navigate("/")
            return
        }

        const controller = new AbortController()
        const signal = controller.signal

        const handleMessageList = async () => {
            setMessagesList([])

            try {
                const [messenger, messages, reactions] = await Promise.all([
                    UserService.fetchMessenger(user.userId, type, id, signal),
                    UserService.fetchMessages(user.userId, type, id, undefined, signal),
                    MessengerService.getReactions((type === 'channel' && id) ? id : undefined)
                ])

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

                if (!!adaptMessenger.id) {
                    setMessenger(adaptMessenger)
                    setMessagesList(messages.data)
                    setReactions(reactions.data)
                }
            } catch (error) {
                const message = isServerError(error)

                dispatch(setPopupMessageState(true))
                dispatch(setPopupMessageChildren(message))
                navigate('/')
            }
        }

        handleMessageList()

        return () => controller.abort()
    }, [user.userId, id, navigate, setMessagesList])

    useEffect(() => {
        const timeout = setTimeout(() => refEnd.current?.scrollIntoView({behavior: 'smooth'}), 300)
        return () => clearTimeout(timeout)
    }, [messagesList])

    const [animation, setAnimation] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let timer: NodeJS.Timeout | null

        if (comment.commentState) setAnimation(true)
        else {
            timer = setTimeout(() => setComment(prev => ({
                ...prev,
                comment: null
            })), 300)
            setAnimation(false)
        }

        return () => {
            timer && clearTimeout(timer)
        }
    }, [comment.commentState])

    const subscribeToMessenger = async () => {
        if (!id) return

        try {
            const newMembers = await MessengerService.postContactsMembers([user.userId], id)
            if (newMembers.data.message) return
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {messenger &&
                <CSSTransition
                    in={animation}
                    nodeRef={wrapperRef}
                    timeout={300}
                    classNames='show-node'
                >
                    <>
                        <div className={style.Wrapper} ref={wrapperRef}>
                            <div className={style.ChatContainer}>
                                <MessengerHeader messenger={messenger} setSidebarState={setSidebarState}/>
                                <section className={style.MessageBlock} key={id}>
                                    {messagesList.map(message =>
                                        <Message
                                            message={message}
                                            postId={message.message_id}
                                            messenger={messenger}
                                            key={message.message_id}
                                            setReply={setReply}
                                            socketRoom={id}
                                            socketRef={socketRef}
                                            setComment={setComment}
                                            reactions={reactions}
                                        />
                                    )}
                                    <div ref={refEnd}/>
                                </section>
                                {isMember(messenger.members!, user.userId) ?
                                    (messenger.type === "channel" ? checkRights(messenger.members!, user.userId) : true) && id &&
                                    <InputBlock
                                        setReply={setReply}
                                        reply={reply}
                                        socketRef={socketRef}
                                        socketRoom={id}
                                    /> :
                                    <button className={style.SubscribeButton} onClick={subscribeToMessenger}>
                                        Subscribe
                                    </button>
                                }
                            </div>
                            {comment.comment &&
                                <CommentsBlock
                                    channelPost={comment.comment}
                                    messenger={messenger}
                                    setState={setComment}
                                    reactions={reactions}
                                />}
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
                </CSSTransition>
            }
        </>
    )
}

export default Messenger