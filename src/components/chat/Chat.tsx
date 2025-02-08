import React, {useEffect, useRef, useState} from 'react'
import style from './style.module.css'
import './animation.css'
import InputBlock from "../inputBlock/InputBlock";
import LoadImage from "../loadImage/LoadImage"
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineLockClosed,
    HiOutlineXMark
} from "react-icons/hi2"
import Buttons from "../buttons/Buttons";
import DropDown from "../dropDown/DropDown";
import SearchBlock from "../searchBlock/SearchBlock"
import {CSSTransition} from 'react-transition-group'
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message";

import geralt from './pictures/geralt.png'
import hardware from './pictures/hardware.jpg'
import skeleton from './pictures/skeleton.jpg'
import abstract from './pictures/abstract.png'
import UserService from "../../service/UserService";
import {useAppSelector} from "../../utils/hooks/useRedux";
import {useParams} from "react-router-dom";
import IMessagesResponse from "../../utils/types/IMessagesResponse";

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

const chat = {
    chatImg: '',
    chatTitle: 'Игорь Линк',
    chatLink: 'link1',
    chatDesk: '140609 subscribers',
    chatLastMessageDate: new Date('2025-01-23T11:03:01')
}

const entity = {
    entityImage: '',
    entityType: 'User',
    entityTitle: 'Український Наступ | #УкрТг ∆',
    entityLink: 't.me/ukrnastup',
    entityDesc: '140 609 subscribers',
    entityBio: 'Боремося на громадсько-мемних фронтах інформаційної війни з 2014-го Боремося на громадсько-мемних фронтах інформаційної війни з 2014-го Боремося на громадсько-мемних інформаційної війни з 2014-го'
}

// const mediaTest = [
//     {
//         mediaId: '41246321.png',
//         mediaUrl: geralt
//     },
//     {
//         mediaId: '41246322.png',
//         mediaUrl: hardware
//     },
//     {
//         mediaId: '41246324.png',
//         mediaUrl: abstract
//     },
//     {
//         mediaId: '41246323.png',
//         mediaUrl: skeleton
//     }]
//
// const documents= [
//     {
//         documentId: '13156213',
//         documentName: 'Pauers_JavaScript-Recepty-dlya-razrabotchikov.pdf',
//         documentSize: 1000000,
//         documentUrl: './documents/Pauers_JavaScript-Recepty-dlya-razrabotchikov.pdf'
//     },
//     {
//         documentId: '13156223',
//         documentName: 'Pauers_JavaScript-Recepty-dlya-razrabotchikov.pdf',
//         documentSize: 5000000,
//         documentUrl: './documents/Pauers_JavaScript-Recepty-dlya-razrabotchikov.pdf'
//     },
//     ]

const Chat = () => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)
    const [sidebarState, setSidebarState] = useState(false)
    const refSearch = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    const [messagesList, setMessagesList] = useState<IMessagesResponse[]>([])

    const user = useAppSelector(state => state.user)
    const {id} = useParams()

    useEffect(() => {
        const handleMessageList = async () => {
            try {
                if (id) {
                    const list = await UserService.fetchMessages(user.userId, id)
                    if (list.data) setMessagesList(list.data)
                }
            } catch (e) {}

            return true
        }

        handleMessageList().catch()
    }, [user.userId, id])
    console.log(messagesList)

    return (
        <>
            <div className={style.ChatContainer}>
                <header>
                    <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                        <LoadImage imagePath={chat.chatImg} imageTitle={chat.chatTitle}/>
                        <div>
                            <h3>{chat.chatTitle}</h3>
                            <p>{chat.chatDesk}</p>
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
                    {messagesList.map(message => <Message.ChatMessage message={message} key={message.message_id}/>)}
                </div>
                <InputBlock/>
            </div>
            <RightSidebar entity={entity} ref={refRightSidebar} state={sidebarState} setState={setSidebarState}/>
        </>
    )
}

export default Chat