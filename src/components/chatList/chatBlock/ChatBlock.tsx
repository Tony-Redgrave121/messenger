import React, {memo} from 'react';
import {LoadFile} from "@components/loadFile";
import style from './style.module.css'
import {Link} from "react-router-dom";
import {getDate} from "@utils/logic/getDate";
import {IMessengersListResponse} from "@appTypes";

interface IChatBlock {
    messenger: IMessengersListResponse
}

const ChatBlock: React.FC<IChatBlock> = memo(({messenger}) => {
    return (
        <Link to={`${messenger.messenger_type}/${messenger.messenger_id}`} className={style.ChatContainer}>
            <LoadFile imagePath={messenger.messenger_image ? `messengers/${messenger.messenger_id}/${messenger.messenger_image}` : ''} imageTitle={messenger.messenger_name}/>
            <div className={style.DescContainer}>
                <span>
                    <h3>{messenger.messenger_name}</h3>
                    {messenger.messages[0]?.message_date && <p>{getDate(messenger.messages[0].message_date)}</p>}
                </span>
                {messenger.messages[0]?.message_text && <p>{messenger.messages[0].message_text}</p>}
            </div>
        </Link>
    )
})

export default ChatBlock