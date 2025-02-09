import React, {memo} from 'react';
import LoadFile from "../../loadFile/LoadFile";
import style from './style.module.css'
import {Link} from "react-router-dom";
import {getDate} from "../../../utils/logic/getDate";
import IMessengerResponse from "../../../utils/types/IMessengerResponse";

interface IChatBlock {
    messenger: IMessengerResponse
}

const ChatBlock: React.FC<IChatBlock> = memo(({messenger}) => {
    return (
        <Link to={`${messenger.messenger_type}/${messenger.messenger_id}`} className={style.ChatContainer}>
            <LoadFile imagePath={`messengers/${messenger.messenger_id}/${messenger.messenger_image}`} imageTitle={messenger.messenger_name}/>
            <div className={style.DescContainer}>
                <span>
                    <h3>{messenger.messenger_name}</h3>
                    {/*{messenger.messengerLastMessageDate && <p>{getDate(messenger.messengerLastMessageDate)}</p>}*/}
                </span>
                {/*{messenger.messengerLastMessage && <p>{messenger.messengerLastMessage}</p>}*/}
            </div>
        </Link>
    )
})

export default ChatBlock