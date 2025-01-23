import React from 'react'
import ChatBlock from "./chatBlock/ChatBlock";

const ChatList = () => {
    const list = [
        {
            chatImg: '',
            chatTitle: 'Игорь Линк',
            chatLink: 'link1',
            chatLastMessage: 'Lorem ipsum dolor sit amet.',
            chatLastMessageDate: new Date('2025-01-23T11:03:01')
        },
        {
            chatImg: '',
            chatTitle: 'Марципановый Ликёр',
            chatLink: 'link2',
            chatLastMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            chatLastMessageDate: new Date('2024-01-23T15:12:15')
        },
        {
            chatImg: '',
            chatTitle: 'Український Наступ | #УкрТг ∆',
            chatLink: 'link3',
            chatLastMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, voluptates.',
            chatLastMessageDate: new Date('2025-01-15T09:09:25')
        },
        {
            chatImg: '',
            chatTitle: 'Eq 21-01',
            chatLink: 'link3',
            chatLastMessage: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, voluptates.',
            chatLastMessageDate: new Date('2025-01-15T09:09:25')
        },
    ]

    return (
        <ul>
            {
                list.map(chat =>
                    <ChatBlock chat={chat} key={chat.chatTitle}/>
                )
            }
        </ul>
    )
}

export default ChatList