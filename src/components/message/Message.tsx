import React, {useCallback, useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import Slider from "@components/slider/Slider";
import MediaBlock from "../media/mediaBlock/MediaBlock";
import {getTime} from "@utils/logic/getDate";
import {
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineDocumentArrowDown,
    HiOutlineTrash
} from "react-icons/hi2"
import IMessagesResponse from "../../types/IMessagesResponse";
import {useAppSelector} from "@hooks/useRedux";
import {DropDown} from "../dropDown";
import DocumentBlock from "./documentBlock/DocumentBlock";
import UserService from "../../service/UserService";
import {useParams} from "react-router-dom";
import IMessageFile from "../../types/IMessageFile";

interface IChatMessage {
    message: IMessagesResponse,
    setReply: React.Dispatch<React.SetStateAction<IMessagesResponse | null>>,
    socketRef: React.RefObject<WebSocket | null>
}

namespace Message {
    export const ChatMessage: React.FC<IChatMessage> = ({message, setReply, socketRef}) => {
        const {id} = useParams()
        const [contextMenu, setContextMenu] = useState(false)
        const user_id = useAppSelector(state => state.user.userId)

        const handleDelete = useCallback(async () => {
            if (!id) return
            const messageDelete = await UserService.deleteMessage(message.message_id, id)

            if (messageDelete && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    messenger_id: id,
                    user_id: user_id,
                    method: 'REMOVE_MESSAGE',
                    data: messageDelete.data
                }))
            }
        }, [id, message.message_id, socketRef, user_id])

        const list = [
            {
                liChildren: <HiOutlineArrowUturnLeft/>,
                liText: 'Reply',
                liFoo: () => setReply(message)
            },
            {
                liChildren: <HiOutlineDocumentDuplicate/>,
                liText: 'Copy',
                liFoo: () => message.message_text && window.navigator.clipboard.writeText(message.message_text)
            },
            {
                liChildren: <HiOutlineDocumentArrowDown/>,
                liText: 'Download',
                liFoo: () => {}
            },
            {
                liChildren: <HiOutlineTrash/>,
                liText: 'Delete',
                liFoo: () => {
                    handleDelete().catch(e => console.error(e))
                    setContextMenu(false)
                }
            }
        ]

        const [animationState, setAnimationState] = useState(false)
        const [position, setPosition] = useState({x: 0, y: 0})

        const [currMedia, setCurrMedia] = useState({
            message_file_id: '',
            message_file_name: ''
        })
        const refSlider = useRef<HTMLDivElement>(null)
        const [mediaArr, setMediaArr] = useState<IMessageFile[] | undefined>()

        useEffect(() => {
            if (message.message_files && message.message_type === 'media') {
                setMediaArr(message.message_files)
                setCurrMedia(message.message_files[0])
            }
        }, [message.message_files, message.message_type])


        const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            const parent = event.currentTarget.getBoundingClientRect()

            let x = event.clientX - parent.left, y = event.clientY - parent.top
            const clientWidth = event.currentTarget.clientWidth, clientHeight = event.currentTarget.clientHeight

            if (x + 170 > clientWidth) x = clientWidth - 170
            if (y + 100 > clientHeight) y = clientHeight - 100

            setPosition({x: x, y: y})
            setContextMenu(!contextMenu)
        }

        return (
            <div className={`${style.ChatMessageContainer} ${message.user_id === user_id ? style.Owner : ''}`}>
                {message.reply &&
                    <button className={style.ReplyBlock}>
                        <h4>{message.reply.user.user_name}</h4>
                        <p>{message.reply.message_text}</p>
                    </button>
                }
                <div className={style.ChatMessageBlock} onContextMenu={(event) => handleContextMenu(event)}>
                    {(mediaArr && mediaArr.length > 0) &&
                        <MediaBlock.Slider media={mediaArr} setSlider={setAnimationState} setCurrMedia={setCurrMedia}/>
                    }
                    {(message.message_files && message.message_type === 'document') &&
                        <div className={style.ChatDocumentBlock}>
                            {message.message_files.map(doc => <DocumentBlock doc={doc} key={doc.message_file_id}/>)}
                        </div>
                    }
                    <p>
                        {message.message_text}
                        <small>{getTime(message.message_date)}</small>
                    </p>
                    <DropDown list={list} state={contextMenu} setState={setContextMenu} position={position}/>
                </div>
                {mediaArr && mediaArr.length > 0 &&
                    <Slider animation={{
                        state: animationState,
                        setState: setAnimationState,
                        ref: refSlider
                    }} media={{
                        mediaArr: mediaArr,
                        setMediaArr: setMediaArr,
                        currentSlide: currMedia
                    }} user={{
                        owner_id: message.user.user_id,
                        owner_image: message.user.user_img,
                        owner_name: message.user.user_name,
                        message_date: message.message_date
                    }}
                    />
                }
            </div>
        )
    }
}

export default Message