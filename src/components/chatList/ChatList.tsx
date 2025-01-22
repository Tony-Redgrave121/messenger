import React from 'react'
import ChatBlock from "./chat/ChatBlock";

const ChatList = () => {
    const list = [
        {
            chatImg: '',
            chatTitle: 'Chat',
            chatLastMessage: 'Last message',
            chatLastMessageDate: new Date()
        }
    ]

    return (
        <ul>
            {
                list.map(chat =>
                    <ChatBlock />
                )
            }
        </ul>
    )
}

export default ChatList