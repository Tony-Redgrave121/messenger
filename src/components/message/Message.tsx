import React, {useEffect, useRef, useState} from 'react'
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
    media?: Array<{
        mediaId: string,
        mediaUrl: string
    }>,
    date: Date,
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({text, reply, type, owner = false, media, ownerName, date}) => {
        const [animationState, setAnimationState] = useState(false)
        const [currMedia, setCurrMedia] = useState({
            mediaId: '',
            mediaUrl: ''
        })
        const refSlider = useRef<HTMLDivElement>(null)
        const [mediaArr, setMediaArr] = useState(media)

        useEffect(() => {
            media && setCurrMedia(media[0])
        }, [media])

        return (
            <div className={`${style.ChatMessageContainer} ${owner && style.Owner}`}>
                {reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{reply.reply_name}</h4>
                        <p>{reply.reply_text}</p>
                    </button>
                }
                <div className={style[`ChatMessage${type}`]}>
                    {(mediaArr && mediaArr.length > 0) &&
                        <MediaBlock media={mediaArr} setSlider={setAnimationState} setCurrMedia={setCurrMedia}/>
                    }
                    <p>{text}</p>
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
                    }} user={{owner: ownerName, date: date}}
                    />
                }
            </div>
        )
    }
}

export default Message