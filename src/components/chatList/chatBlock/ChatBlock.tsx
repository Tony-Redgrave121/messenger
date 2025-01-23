import React from 'react';
import LoadImage from "../../loadImage/LoadImage";
import style from './style.module.css'
import {Link} from "react-router-dom";

interface IChatBlock {
    chat: {
        chatImg: string,
        chatTitle: string,
        chatLink: string,
        chatLastMessage: string,
        chatLastMessageDate: Date
    }
}

const ChatBlock: React.FC<IChatBlock> = ({chat}) => {
    const getDate = (date: Date) => {
        const newDate = new Date(date)
        const currentDate = new Date()
        const time = new Date().getTime() - newDate.getTime()

        if (time <= 86400000) {
            return `${newDate.getHours()}:${newDate.getMinutes()}`
        } else if (time <= 86400000 * new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0).getDate()) {
            return `${newDate.toLocaleString('en', { month: 'short'})} ${newDate.getDate()}`
        } else {
            return `${newDate.getMonth() + 1}/${newDate.getDay()}/${newDate.getFullYear()}`
        }
    }

    return (
        <Link to={`chat/${chat.chatLink}`} className={style.ChatContainer}>
            <LoadImage chatImg={chat.chatImg} chatTitle={chat.chatTitle}/>
            <div className={style.DescContainer}>
                <span>
                    <h3>{chat.chatTitle}</h3>
                    <p>{getDate(chat.chatLastMessageDate)}</p>
                </span>
                <p>{chat.chatLastMessage}</p>
            </div>
        </Link>
    )
}

export default ChatBlock