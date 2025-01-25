import React from 'react'
import style from './style.module.css'
import InputBlock from "../inputBlock/InputBlock";
import LoadImage from "../loadImage/LoadImage";
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineLockClosed
} from "react-icons/hi2"
import Buttons from "../buttons/Buttons";
import Popup from "../popup/Popup";

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

const Chat = () => {
    const [settings, setSettings] = React.useState(false)

    return (
        <div className={style.ChatContainer}>
            <header>
                <div className={style.DeskBlock}>
                    <LoadImage chatImg={chat.chatImg} chatTitle={chat.chatTitle}/>
                    <div>
                        <h3>{chat.chatTitle}</h3>
                        <p>{chat.chatDesk}</p>
                    </div>
                </div>
                <span>
                    <Buttons.DefaultButton>
                        <HiOutlineMagnifyingGlass/>
                    </Buttons.DefaultButton>
                    <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                        <HiEllipsisVertical/>
                        <Popup list={list} state={settings} setState={setSettings}/>
                    </Buttons.DefaultButton>
                </span>
            </header>
            <div className={style.Chat}>
                <InputBlock/>
            </div>
        </div>
    )
}

export default Chat