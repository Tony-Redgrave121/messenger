import React, {useRef, useState} from 'react'
import {
    HiBars3,
    HiOutlineCog8Tooth,
    HiOutlineBookmark,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineBugAnt
} from "react-icons/hi2"
import style from './style.module.css'
import Buttons from '../../buttons/Buttons'
import SearchBlock from "../../searchBlock/SearchBlock"
import ChatList from "../../chatList/ChatList"
import Popup from "../../popup/Popup"
import SidebarContainer from "../SidebarContainer";

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

const LeftSidebar = () => {
    const [settings, setSettings] = useState(false)
    const refSearch = useRef<HTMLDivElement>(null)

    return (
        <SidebarContainer>
            <div className={style.TopBar}>
                <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                    <HiBars3/>
                    <Popup list={list} state={settings} setState={setSettings}/>
                </Buttons.DefaultButton>
                <SearchBlock ref={refSearch}/>
            </div>
            <ChatList/>
        </SidebarContainer>
    )
}

export default LeftSidebar