import React, {ChangeEvent, Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {
    HiOutlineFaceSmile,
    HiMiniPaperClip,
    HiOutlinePaperAirplane,
    HiOutlineDocument,
    HiOutlineFolderOpen,
    HiOutlineArrowUturnLeft, HiOutlineXMark
} from "react-icons/hi2"
import {Buttons} from '@components/buttons'
import style from './style.module.css'
import {DropDown} from "../dropDown"
import useEmojis from "./useEmojis"
import {PopupContainer} from "@components/popup";
import {IFilesState, IMessagesResponse} from "@appTypes"
import {TextareaBlock} from "@components/textareaBlock";
import {PopupInputBlock} from "@components/popup";
import UserService from "../../service/UserService"
import {useParams} from "react-router-dom";
import {useAppSelector} from "@hooks/useRedux";
import getFileObject from "../../utils/logic/getFileObject";

interface IInputBlock {
    reply: IMessagesResponse | null,
    setReply: Dispatch<SetStateAction<IMessagesResponse | null>>
    socketRef: RefObject<WebSocket | null>
}

const InputBlock: FC<IInputBlock> = ({reply, setReply, socketRef}) => {
    const [inputText, setInputText] = useState('')
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    const [emoji, setEmoji] = useState(false)
    const emojis = useEmojis(refTextarea, setInputText)

    const [upload, setUpload] = useState(false)
    const [filesState, setFilesState] = useState<IFilesState>({
        files: null,
        popup: false,
        type: ''
    })
    const filesRef = useRef<File[]>(null)

    useEffect(() => {
        if (filesState.files) setFilesState(prev => ({...prev, popup: true}))
    }, [filesState.files])

    const uploadFiles = (event: ChangeEvent<HTMLInputElement>, type: string) => {
        if (filesRef) {
            filesRef.current = Array.from(event.target.files ? event.target.files : [])

            const files = getFileObject(event.target.files)

            setFilesState(prev => ({
                ...prev,
                type: type,
                files: files
            }))
        }
    }

    const {id} = useParams()
    const user_id = useAppSelector(state => state.user.userId)

    const handleSubmit = async () => {
        if ((filesState.files || inputText) && socketRef.current) {
            const message = new FormData()
            message.append('message_text', inputText)
            message.append('message_type', filesState.files ? filesState.type : 'message')
            reply && message.append('reply_id', reply.message_id)
            message.append('user_id', user_id)
            message.append('messenger_id', id!)

            if (filesRef && filesRef.current) {
                filesRef.current.forEach((file: File) => message.append('message_files', file))
                filesRef.current = null
            }

            setFilesState({
                files: null,
                popup: false,
                type: ''
            })

            setInputText('')
            if (refTextarea && refTextarea.current) refTextarea.current.value = ''

            setReply(null)

            const newMessage = await UserService.postMessage(message).catch(error => console.log(error))

            if (newMessage && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    messenger_id: id,
                    user_id: user_id,
                    method: 'POST_MESSAGE',
                    data: newMessage.data
                }))
            }
        }
    }

    const dropDownUpload = [
        {
            liChildren:
                <>
                    <label htmlFor="media"><HiOutlineFolderOpen/> Photo or Video</label>
                    <input name='media' id='media' type="file" accept='image/*, video/*' style={{display: 'none'}}
                           onChange={(event) => uploadFiles(event, 'media')} multiple/>
                </>,
            liFoo: () => {
            }
        },
        {
            liChildren:
                <>
                    <label htmlFor="documentInput"><HiOutlineDocument/> Document</label>
                    <input name='document' id='documentInput' type="file" style={{display: 'none'}}
                           onChange={(event) => uploadFiles(event, 'document')} multiple/>
                </>,
            liFoo: () => {
            }
        }
    ]

    const handleCancel = () => {
        setFilesState(prev => ({...prev, popup: false}))

        setTimeout(() => setFilesState({
            files: null,
            popup: false,
            type: ''
        }), 300)
    }

    return (
        <div className={style.InputContainer}>
            <div className={style.Input}>
                {reply &&
                    <div className={style.ReplyBlock}>
                        <span><HiOutlineArrowUturnLeft/></span>
                        <button className={style.ReplyMessage}>
                            <h4>Reply to {reply.user.user_name}</h4>
                            <p>{reply.message_text}</p>
                        </button>
                        <Buttons.DefaultButton foo={() => setReply(null)}>
                            <HiOutlineXMark/>
                        </Buttons.DefaultButton>
                    </div>
                }
                <div className={style.InputBlock}>
                    <Buttons.DefaultButton foo={() => setEmoji(!emoji)}>
                        <HiOutlineFaceSmile/>
                        <DropDown list={emojis} state={emoji} setState={setEmoji} styles={['EmojiContainer']}/>
                    </Buttons.DefaultButton>
                    <TextareaBlock ref={refTextarea} inputText={inputText} setInputText={setInputText}/>
                    <Buttons.DefaultButton foo={() => setUpload(!upload)}>
                        <HiMiniPaperClip/>
                        <DropDown list={dropDownUpload} state={upload} setState={setUpload}/>
                    </Buttons.DefaultButton>
                    {filesState.files &&
                        <PopupContainer
                            state={filesState.popup}
                            handleCancel={handleCancel}>
                            <PopupInputBlock
                                type={filesState.type}
                                files={filesState.files}
                                setState={setFilesState}
                                setInputText={setInputText}
                                inputText={inputText}
                                handleSubmit={handleSubmit}
                                filesRef={filesRef}
                                handleCancel={handleCancel}
                            />
                        </PopupContainer>
                    }
                </div>
            </div>
            <Buttons.InterButton foo={handleSubmit}>
                <HiOutlinePaperAirplane/>
            </Buttons.InterButton>
        </div>
    )
}

export default InputBlock