import React from 'react'
import { HiBars3 } from "react-icons/hi2"
import style from './style.module.css'
import Buttons from '../buttons/Buttons'
import SearchBlock from "../searchBlock/SearchBlock"
import ChatList from "../chatList/ChatList";

const Sidebar = () => {
    return (
        <aside className={style.SidebarContainer}>
            <div className={style.TopBar}>
                <Buttons.DefaultButton><HiBars3 /></Buttons.DefaultButton>
                <SearchBlock />
            </div>
            <ChatList />
        </aside>
    )
}

export default Sidebar