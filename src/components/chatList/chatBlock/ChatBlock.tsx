import React from 'react';
import LoadImage from "../../loadImage/LoadImage";
import style from './style.module.css'
import {Link} from "react-router-dom";
import {getDate} from "../../../utils/logic/getDate";

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