import React, {useRef, useState} from 'react'
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
import Popup from "../popup/Popup";
import SearchBlock from "../searchBlock/SearchBlock"
import {CSSTransition} from 'react-transition-group'
import RightSidebar from "../sidebar/rightSidebar/RightSidebar"
import Message from "../message/Message";


import geralt from './pictures/geralt.png'
import hardware from './pictures/hardware.jpg'
import skeleton from './pictures/skeleton.jpg'
import ASCII from './pictures/ASCII Art.png'


const list = [
    {
        liIcon: <HiOutlineBellSlash/>,
        liText: 'Mute',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineUserPlus/>,
        liText: 'Add to contacts',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineLockClosed/>,
        liText: 'Block user',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineTrash/>,
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

const Chat = () => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)
    const [sidebarState, setSidebarState] = useState(false)

    const refSearch = useRef<HTMLDivElement>(null)
    const refRightSidebar = useRef<HTMLDivElement>(null)

    return (
        <>
            <div className={style.ChatContainer}>
                <header>
                    <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                        <LoadImage chatImg={chat.chatImg} chatTitle={chat.chatTitle}/>
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
                            <Popup list={list} state={settings} setState={setSettings}/>
                        </Buttons.DefaultButton>
                    </span>
                </header>
                <div className={style.Chat}>
                    <div className={style.MessageBlock}>
                        <Message.ChatMessage type='Message' date={new Date()} text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, dolores!' ownerName='Igor Link'/>
                        <Message.ChatMessage type='Message' date={new Date()} owner={true} text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, dolores!' ownerName='Igor Link'/>
                        <Message.ChatMessage type='Media' date={new Date()} owner={true} text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, dolores!' media={[geralt, hardware, skeleton, ASCII]} reply={{reply_name: 'Igor Link', reply_text: 'Lorem ipsum dolor sit amet'}} ownerName='Tony Redgrave'/>
                    </div>
                    <InputBlock/>
                </div>
            </div>
            <RightSidebar entity={entity} ref={refRightSidebar} state={sidebarState} setState={setSidebarState}/>
        </>
    )
}

export default Chat