import React, {memo, useEffect, useState} from 'react';
import {LoadFile} from "@components/loadFile";
import style from './style.module.css'
import {Link} from "react-router-dom";
import {getDate} from "@utils/logic/getDate";
import {IMessengersListResponse} from "@appTypes";
import {useAppSelector} from "@hooks/useRedux";

interface IChatBlock {
    messenger: IMessengersListResponse
}

const ChatBlock: React.FC<IChatBlock> = memo(({messenger}) => {
    const [notificationCount, setNotificationCount] = useState(0)

    const notifications = useAppSelector(state => state.live.notifications)

    useEffect(() => {
        const count = notifications?.[messenger.messenger_id] ?? 0
        setNotificationCount(count)
    }, [notifications, messenger.messenger_id])

    return (
        <Link to={`${messenger.messenger_type}/${messenger.messenger_id}`} className={style.ChatContainer}>
            <LoadFile imagePath={
                messenger.messenger_image ? `${messenger.messenger_type !== "chat" ? "messengers" : "users"}/${messenger.messenger_id}/${messenger.messenger_image}` : ''
            } imageTitle={messenger.messenger_name}/>
            <div className={style.DescContainer}>
                <span className={style.MessengerInfo}>
                    <p>{messenger.messenger_name}</p>
                    {messenger.messages[0]?.message_date && <p>{getDate(messenger.messages[0].message_date)}</p>}
                </span>
                <span className={style.MessageInfo}>
                    {messenger.messages.length > 0 && <p>{messenger.messages[0].message_text ? messenger.messages[0].message_text : 'Media'}</p>}
                    {notificationCount ? <b>{notificationCount}</b> : ''}
                </span>
            </div>
        </Link>
    )
})

export default ChatBlock