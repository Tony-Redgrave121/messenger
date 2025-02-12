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
    HiOutlineXMark
} from "react-icons/hi2"
import Buttons from "../buttons/Buttons"
import DropDown from "../dropDown/DropDown"
import SearchBlock from "../searchBlock/SearchBlock"
import {CSSTransition} from 'react-transition-group'
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message"
import UserService from "../../service/UserService"
import {useAppSelector} from "../../utils/hooks/useRedux"
import {useParams} from "react-router-dom"
import IMessagesResponse from "../../utils/types/IMessagesResponse"
import IMessengerResponse from "../../utils/types/IMessengerResponse"

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
    const refMessageBlock = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)
    const [messagesList, setMessagesList] = useState<IMessagesResponse[]>([])
    const [messenger, setMessenger] = useState<IMessengerResponse>()
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const {id} = useParams()

    const user_id = useAppSelector(state => state.user.userId)
    const user = useAppSelector(state => state.user)

    useEffect(() => {
        const handleMessageList = async () => {
            if (id) {
                Promise.all([
                    UserService.fetchMessages(user.userId, id),
                    UserService.fetchMessenger(user_id)
                ]).then(data => {
                    setMessagesList(data[0].data)
                    setMessenger(data[1].data)
                }).catch(error => console.log(error))
            }

            return true
        }

        handleMessageList().catch()
    }, [user.userId, id, user_id])

    useEffect(() => {
        refMessageBlock.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messagesList])

    return (
        <>
            {messenger &&
                <>
                    <div className={style.ChatContainer}>
                        <header>
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
                                <Message.ChatMessage message={message} key={message.message_id} setReply={setReply}/>
                            )}
                            {messagesList.length > 0 && <div ref={refMessageBlock}/>}
                        </div>
                        <InputBlock setReply={setReply} reply={reply}/>
                    </div>
                    <RightSidebar entity={messenger} ref={refRightSidebar} state={sidebarState} setState={setSidebarState}/>
                </>
            }
        </>
    )
}

export default Chat