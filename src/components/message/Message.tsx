import React, {useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import Slider from "../slider/Slider";
import MediaBlock from "../media/mediaBlock/MediaBlock";
import {getTime} from "../../utils/logic/getDate";
import { HiOutlineDocumentText } from "react-icons/hi2"
import IMessagesResponse from "../../utils/types/IMessagesResponse";
import {useAppSelector} from "../../utils/hooks/useRedux";

interface IChatMessage {
    message: IMessagesResponse,
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({message}) => {
        const [animationState, setAnimationState] = useState(false)
        const [currMedia, setCurrMedia] = useState({
            message_file_id: '',
            message_file_name: ''
        })
        const refSlider = useRef<HTMLDivElement>(null)
        const [mediaArr, setMediaArr] = useState<{
            message_file_id: string,
            message_file_name: string
        }[] | undefined>()

        useEffect(() => {
            if (message.message_files) {
                setCurrMedia(message.message_files[0])
            }
        }, [message.message_files])

        const user_id = useAppSelector(state => state.user.userId)

        return (
            <div className={`${style.ChatMessageContainer} ${message.user_id === user_id && style.Owner}`}>
                {message.reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{message.reply.user.user_name}</h4>
                        <p>{message.reply.message_text}</p>
                    </button>
                }
                <div className={style.ChatMessageBlock}>
                    {(mediaArr && mediaArr.length > 0) &&
                        <MediaBlock media={mediaArr} setSlider={setAnimationState} setCurrMedia={setCurrMedia}/>
                    }
                    {(message.message_files && message.message_type === 'document') &&
                        <div className={style.ChatDocumentBlock}>
                            {message.message_files.map(doc => (
                                <a download={doc.message_file_name} href={doc.message_file_name} key={doc.message_file_id}>
                                    <HiOutlineDocumentText/>
                                    <div>
                                        <h4>{doc.message_file_name}</h4>
                                        <p>{(doc.message_file_size / 1048576).toFixed(2)} MB &#183;</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    }
                    <p>
                        {message.message_text}
                        <small>{getTime(message.message_date)}</small>
                    </p>
                </div>
                {mediaArr &&
                    <Slider animation={{
                        state: animationState,
                        setState: setAnimationState,
                        ref: refSlider
                    }} media={{
                        mediaArr: mediaArr,
                        setMediaArr: setMediaArr,
                        currentSlide: currMedia
                    }} user={{owner: message.user.user_name, date: message.message_date}}
                    />
                }
            </div>
        )
    }
}

export default Message