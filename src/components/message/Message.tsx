import React, {Dispatch, FC, RefObject, SetStateAction, useCallback, useEffect, useRef, useState} from 'react'
import style from "./style.module.css"
import {Slider} from "@components/slider";
import {MediaBlock} from "@components/media";
import {getTime} from "@utils/logic/getDate";
import {
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineDocumentArrowDown,
    HiOutlineTrash
} from "react-icons/hi2"
import {IMessagesResponse, IMessageFile} from "@appTypes";
import {useAppSelector} from "@hooks/useRedux";
import {DropDown} from "../dropDown";
import {DocumentBlock} from "@components/message";
import UserService from "../../service/UserService";
import {useParams} from "react-router-dom";

interface IChatMessage {
    message: IMessagesResponse,
    setReply: Dispatch<SetStateAction<IMessagesResponse | null>>,
    socketRef: RefObject<WebSocket | null>
}

const initialCurrMedia = {
    message_file_id: '',
    message_file_name: '',
    message_file_size: 0
}

namespace Message {
    export const ChatMessage: FC<IChatMessage> = ({message, setReply, socketRef}) => {
        const {id} = useParams()
        const [contextMenu, setContextMenu] = useState(false)
        const [position, setPosition] = useState({x: 0, y: 0})
        const [currMedia, setCurrMedia] = useState(initialCurrMedia)
        const refSlider = useRef<HTMLDivElement>(null)
        const [mediaArr, setMediaArr] = useState<IMessageFile[]>([])
        const user_id = useAppSelector(state => state.user.userId)
        const [slider, setSlider] = useState({
            state: false,
            mounted: false
        })

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
                        <MediaBlock.MessageMedia media={mediaArr} setSlider={setSlider} setCurrMedia={setCurrMedia}/>
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
                {slider.mounted && mediaArr &&
                    <Slider animation={{
                        state: slider.state,
                        setState: setSlider,
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