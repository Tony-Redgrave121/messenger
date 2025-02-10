import React, {useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import Slider from "../slider/Slider";
import MediaBlock from "../media/mediaBlock/MediaBlock";
import {getTime} from "../../utils/logic/getDate";
import {
    HiOutlineDocumentText,
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineDocumentArrowDown,
    HiOutlineTrash
} from "react-icons/hi2"
import IMessagesResponse from "../../utils/types/IMessagesResponse";
import {useAppSelector} from "../../utils/hooks/useRedux";
import DropDown from "../dropDown/DropDown";

interface IChatMessage {
    message: IMessagesResponse,
    reply: IMessagesResponse | null,
    setReply: React.Dispatch<React.SetStateAction<IMessagesResponse | null>>
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({message, reply, setReply}) => {
        const list = [
            {
                liChildren: <HiOutlineArrowUturnLeft/>,
                liText: 'Reply',
                liFoo: () => {}
            },
            {
                liChildren: <HiOutlineDocumentDuplicate/>,
                liText: 'Copy',
                liFoo: () => {}
            },
            {
                liChildren: <HiOutlineDocumentArrowDown/>,
                liText: 'Download',
                liFoo: () => {}
            },
            {
                liChildren: <HiOutlineTrash/>,
                liText: 'Delete',
                liFoo: () => {}
            },
        ]

        const [animationState, setAnimationState] = useState(false)
        const [contextMenu, setContextMenu] = useState(false)
        const [position, setPosition] = useState({x: 0, y: 0})

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
                setMediaArr(message.message_files)
                setCurrMedia(message.message_files[0])
            }
        }, [message.message_files])

        const user_id = useAppSelector(state => state.user.userId)

        const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            const parent = event.currentTarget.getBoundingClientRect()

            let x = event.clientX - parent.left, y = event.clientY - parent.top + 50
            const clientWidth = event.currentTarget.clientWidth, clientHeight = event.currentTarget.clientHeight

            if (x + 190 > clientWidth) x = clientWidth - 195
            if (y + 100 > clientHeight) y = clientHeight - 100

            setPosition({x: x, y: y})
            setContextMenu(!contextMenu)
        }

        return (
            <div className={`${style.ChatMessageContainer} ${message.user_id === user_id && style.Owner}`}>
                {message.reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{message.reply.user.user_name}</h4>
                        <p>{message.reply.message_text}</p>
                    </button>
                }
                <div className={style.ChatMessageBlock} onContextMenu={(event) => handleContextMenu(event)}>
                    {(mediaArr && mediaArr.length > 0) &&
                        <MediaBlock media={mediaArr} setSlider={setAnimationState} setCurrMedia={setCurrMedia}/>
                    }
                    {(message.message_files && message.message_type === 'document') &&
                        <div className={style.ChatDocumentBlock}>
                            {message.message_files.map(doc => (
                                <a download={doc.message_file_name} href={doc.message_file_name}
                                   key={doc.message_file_id}>
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
                    <DropDown list={list} state={contextMenu} setState={setContextMenu} position={position}/>
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