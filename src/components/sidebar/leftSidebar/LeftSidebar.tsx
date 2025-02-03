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
import DropDown from "../../dropDown/DropDown"
import SidebarContainer from "../SidebarContainer";

const list = [
    {
        liChildren: <HiOutlineBookmark/>,
        liText: 'Saved Messages',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineUsers/>,
        liText: 'Contacts',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineCog8Tooth/>,
        liText: 'Settings',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineQuestionMarkCircle/>,
        liText: 'Messenger Features',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineBugAnt/>,
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
                    <DropDown list={list} state={settings} setState={setSettings}/>
                </Buttons.DefaultButton>
                <SearchBlock ref={refSearch}/>
            </div>
            <ChatList/>
        </SidebarContainer>
    )
}

export default LeftSidebar