import React, {useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import Slider from "../slider/Slider";
import MediaBlock from "../media/mediaBlock/MediaBlock";
import {getTime} from "../../utils/logic/getDate";
import { HiOutlineDocumentText } from "react-icons/hi2"

interface IChatMessage {
    text?: string,
    reply?: {
        reply_name: string,
        reply_text: string
    },
    owner?: boolean,
    ownerName: string,
    media?: Array<{
        mediaId: string,
        mediaUrl: string
    }>,
    documents?: Array<{
        documentId: string,
        documentName: string,
        documentSize: number
        documentUrl: string
    }>
    date: Date,
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({text, reply, owner = false, media, ownerName, date, documents}) => {
        const [animationState, setAnimationState] = useState(false)
        const [currMedia, setCurrMedia] = useState({
            mediaId: '',
            mediaUrl: ''
        })
        const refSlider = useRef<HTMLDivElement>(null)
        const [mediaArr, setMediaArr] = useState<{
            mediaId: string,
            mediaUrl: string
        }[] | undefined>()

        useEffect(() => {
            if (media) {
                setMediaArr(media)
                media && setCurrMedia(media[0])
            }
        }, [media])

        return (
            <div className={`${style.ChatMessageContainer} ${owner && style.Owner}`}>
                {reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{reply.reply_name}</h4>
                        <p>{reply.reply_text}</p>
                    </button>
                }
                <div className={style.ChatMessageBlock}>
                    {(mediaArr && mediaArr.length > 0) &&
                        <MediaBlock media={mediaArr} setSlider={setAnimationState} setCurrMedia={setCurrMedia}/>
                    }
                    {documents &&
                        <div className={style.ChatDocumentBlock}>
                            {documents.map(doc => (
                                <a download={doc.documentUrl} href={doc.documentUrl} key={doc.documentId}>
                                    <HiOutlineDocumentText/>
                                    <div>
                                        <h4>{doc.documentName}</h4>
                                        <p>{(doc.documentSize / 1048576).toFixed(2)} MB &#183;</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    }
                    <p>
                        {text}
                        <small>{getTime(date)}</small>
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
                    }} user={{owner: ownerName, date: date}}
                    />
                }
            </div>
        )
    }
}

export default Message