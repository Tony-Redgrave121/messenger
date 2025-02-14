import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import './animation.css'
import InputBlock from "../inputBlock/InputBlock"
import LoadFile from "../loadFile/LoadFile"
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineLockClosed,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import Buttons from "../buttons/Buttons"
import DropDown from "../dropDown/DropDown"
import SearchBlock from "../searchBlock/SearchBlock"
import {CSSTransition} from 'react-transition-group'
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message"
import UserService from "../../service/UserService"
import {useAppDispatch, useAppSelector} from "../../utils/hooks/useRedux"
import {useParams} from "react-router-dom"
import IMessagesResponse from "../../utils/types/IMessagesResponse"
import IMessengerResponse from "../../utils/types/IMessengerResponse"
import {setSidebarLeft} from "../../store/reducers/appReducer";

const list = [
    {
        liChildren: <HiOutlineBellSlash/>,
        liText: 'Mute',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineUserPlus/>,
        liText: 'Add to contacts',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineLockClosed/>,
        liText: 'Block user',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineTrash/>,
        liText: 'Delete Chat',
        liFoo: () => {
        }
    }
]

const Chat = () => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)
    const [sidebarState, setSidebarState] = useState(false)

    const refSearch = useRef<HTMLDivElement>(null)
    const refEnd = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)
    const socketRef = useRef<WebSocket | null>(null)

    const [messagesList, setMessagesList] = useState<IMessagesResponse[]>([])
    const [messenger, setMessenger] = useState<IMessengerResponse>()
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const {id} = useParams()

    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const user = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleMessageList = async () => {
            if (id) {
                Promise.all([
                    UserService.fetchMessages(user.userId, id),
                    UserService.fetchMessenger(user.userId)
                ]).then(data => {
                    setMessagesList(data[0].data)
                    setMessenger(data[1].data)
                }).catch(error => console.log(error))
            }

            return true
        }

        handleMessageList().catch()
    }, [user.userId, id])

    useEffect(() => {
        refEnd.current?.scrollIntoView({behavior: 'smooth'})
    }, [messagesList])

    useEffect(() => {
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
                    console.log(`User connected: ${message.user_id}`)
                    break
                case 'POST_MESSAGE':
                    setMessagesList(prev => [...prev, message.data])
                    break
                case 'REMOVE_MESSAGE':
                    setMessagesList(prev => prev.filter(msg => msg.message_id !== message.data))
                    break
                default:
                    console.log(`Unknown message method: ${message.method}`)
                    break
            }
        }

        return () => socket.close()
    }, [id, user.userId])

    return (
        <>
            {messenger &&
                <>
                    <div className={style.Wrapper}>
                        <div className={style.ChatContainer}>
                            <header>
                                <Buttons.DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                                    <HiOutlineArrowLeft/>
                                </Buttons.DefaultButton>
                                <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                                    <LoadFile
                                        imagePath={messenger ? `messengers/${messenger.messenger_id}/${messenger.messenger_image}` : ''}
                                        imageTitle={messenger.messenger_name}/>
                                    <div>
                                        <h3>{messenger.messenger_name}</h3>
                                        <p>{messenger.messenger_type}</p>
                                    </div>
                                </button>
                                <span>
                                <CSSTransition
                                    in={inputState}
                                    nodeRef={refSearch}
                                    timeout={300}
                                    classNames='search-node'
                                    unmountOnExit
                                >
                                    <SearchBlock ref={refSearch}/>
                                </CSSTransition>
                                <Buttons.DefaultButton foo={() => setInputState(!inputState)}>
                                    {inputState ? <HiOutlineXMark/> : <HiOutlineMagnifyingGlass/>}
                                </Buttons.DefaultButton>
                                <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                                    <HiEllipsisVertical/>
                                    <DropDown list={list} state={settings} setState={setSettings}/>
                                </Buttons.DefaultButton>
                            </span>
                            </header>
                            <div className={style.MessageBlock}>
                                {messagesList.length > 0 && messagesList.map(message =>
                                    <Message.ChatMessage message={message} key={message.message_id} setReply={setReply} socketRef={socketRef}/>
                                )}
                                <div ref={refEnd}/>
                            </div>
                            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef}/>
                        </div>
                    </div>
                    <RightSidebar entity={messenger} ref={refRightSidebar} state={sidebarState} setState={setSidebarState}/>
                </>
            }
        </>
    )
}

export default Chat