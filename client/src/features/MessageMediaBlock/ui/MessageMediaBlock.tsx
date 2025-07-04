import React, {FC, memo} from "react";
import style from "./style.module.css";
import {MessageMedia} from "@entities/Media";
import MessageFileSchema from "@entities/Media/model/types/MessageFileSchema";

interface IMessageMediaProps {
    media: MessageFileSchema[],
    messageId: string
}

const MessageMediaBlock: FC<IMessageMediaProps> = memo(({media, messageId}) => {
    return (
        <div className={style.MediaBlock}>
            <MessageMedia media={media[0]} key={media[0].message_file_id} messageId={messageId}/>
            <span>
                {media.slice(1).map(m =>
                    <MessageMedia media={m} key={m.message_file_id} messageId={messageId}/>
                )}
            </span>
        </div>
    )
})

export default MessageMediaBlock