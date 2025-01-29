import React from 'react'
import style from "./style.module.css"
import Slider from "../slider/Slider";
import MediaBlock from "../media/mediaBlock/MediaBlock";

interface IChatMessage {
    text?: string,
    reply?: {
        reply_name: string,
        reply_text: string
    },
    type: string,
    owner?: boolean,
    ownerName: string,
    media?: Array<string>,
    date: Date,
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({text, reply, type, owner = false, media, ownerName, date}) => {
        const [slider, setSlider] = React.useState(false)
        const refSlider = React.useRef<HTMLDivElement>(null)

        return (
            <div className={`${style.ChatMessageContainer} ${owner && style.Owner}`}>
                {reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{reply.reply_name}</h4>
                        <p>{reply.reply_text}</p>
                    </button>
                }
                <div className={style[`ChatMessage${type}`]}>
                    {media && <MediaBlock media={media} setSlider={setSlider}/>}
                    <p>{text}</p>
                </div>
                {media && <Slider ref={refSlider} state={slider} setState={setSlider} media={media} owner={ownerName} date={date}/>}
            </div>
        )
    }
}

export default Message