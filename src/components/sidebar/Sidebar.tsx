import React, {useState} from 'react'
import {
    HiBars3,
    HiOutlineCog8Tooth,
    HiOutlineBookmark,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineBugAnt
} from "react-icons/hi2"
import style from './style.module.css'
import Buttons from '../buttons/Buttons'
import SearchBlock from "../searchBlock/SearchBlock"
import ChatList from "../chatList/ChatList"
import Popup from "../popup/Popup"

const list = [
    {
        liIcon: <HiOutlineBookmark/>,
        liText: 'Saved Messages',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineUsers/>,
        liText: 'Contacts',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineCog8Tooth/>,
        liText: 'Settings',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineQuestionMarkCircle/>,
        liText: 'Messenger Features',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineBugAnt/>,
        liText: 'Report Bug',
        liFoo: () => {
        }
    }
]

const Sidebar = () => {
    const [settings, setSettings] = useState(false)

    return (
        <aside className={style.SidebarContainer}>
            <div className={style.TopBar}>
                <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                    <HiBars3/>
                    <Popup list={list}/>
                </Buttons.DefaultButton>
                <SearchBlock/>
            </div>
            <ChatList/>
        </aside>
    )
}

export default Sidebar