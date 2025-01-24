import React, {useEffect} from 'react'
import style from './style.module.css'
import InputBlock from "../inputBlock/InputBlock";
import LoadImage from "../loadImage/LoadImage";
import { HiOutlineMagnifyingGlass, HiEllipsisVertical } from "react-icons/hi2"
import Buttons from "../buttons/Buttons";

const Chat = () => {
    const chat = {
        chatImg: '',
        chatTitle: 'Игорь Линк',
        chatLink: 'link1',
        chatDesk: '140609 subscribers',
        chatLastMessageDate: new Date('2025-01-23T11:03:01')
    }

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
                        <HiOutlineMagnifyingGlass />
                    </Buttons.DefaultButton>
                    <Buttons.DefaultButton>
                        <HiEllipsisVertical />
                    </Buttons.DefaultButton>
                </span>
            </header>
            <div className={style.Chat}>
                <InputBlock />
            </div>
        </div>
    )
}

export default Chat