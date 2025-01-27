import React from 'react'
import style from "./style.module.css"

interface IChatMessage {
    text?: string,
    reply?: string,
    type: string,
    owner?: boolean,
    files?: Array<string>,
    date: Date,
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({text, reply, type, owner = false, files}) => {
        return (
            <div className={`${style.ChatMessageContainer} ${owner && style.Owner}`}>
                <div className={style[`ChatMessage${type}`]}>
                    <div>
                        { files && files.map((file, index) =>
                                <img src={file} alt=''/>
                            )
                        }
                    </div>
                    <p>{text}</p>
                </div>
            </div>
        )
    }
}

export default Message