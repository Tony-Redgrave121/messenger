import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {
    HiOutlineFaceSmile,
    HiMiniPaperClip,
    HiOutlinePaperAirplane,
    HiOutlineDocument,
    HiOutlineFolderOpen,
    HiOutlineArrowUturnLeft, HiOutlineXMark
} from "react-icons/hi2"
import Buttons from '../buttons/Buttons'
import style from './style.module.css'
import DropDown from "../dropDown/DropDown"
import useEmojis from "./useEmojis"
import PopupContainer from "../popup/PopupContainer";
import FilesState from "../../utils/types/FilesState";
import TextareaBlock from "../textareaBlock/textareaBlock";
import PopupInputBlock from "../popup/popupInputBlock/PopupInputBlock";
import IMessagesResponse from "../../utils/types/IMessagesResponse";

interface IInputBlock {
    reply: IMessagesResponse | null,
    setReply: React.Dispatch<React.SetStateAction<IMessagesResponse | null>>
}

const InputBlock: React.FC<IInputBlock> = ({reply, setReply}) => {
    const [inputText, setInputText] = useState('')
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    const [emoji, setEmoji] = useState(false)
    const emojis = useEmojis(refTextarea, setInputText)

    const [upload, setUpload] = useState(false)
    const [filesState, setFilesState] = useState<FilesState>({
        files: null,
        popup: false,
        type: ''
    })

    useEffect(() => {
        if (filesState.files) {
            setFilesState(prev => ({...prev, popup: true}))
        }
    }, [filesState.files])

    const uploadFiles = (event: ChangeEvent<HTMLInputElement>, type: string) => {
        setFilesState(prev => ({
            ...prev,
            type: type,
            files: Array.from(event.target.files || [])
        }))
    }

    const handleSubmit = () => {

    }

    const dropDownUpload = [
        {
            liChildren:
                <>
                    <label htmlFor="images"><HiOutlineFolderOpen/> Photo or Video</label>
                    <input name='images' id='images' type="file" accept='image/*, video/*' style={{ display: 'none' }} onChange={(event) => uploadFiles(event, 'Image')} multiple/>
                </>,
            liFoo: () => {}
        },
        {
            liChildren:
                <>
                    <label htmlFor="documentInput"><HiOutlineDocument/> Document</label>
                    <input name='document' id='documentInput' type="file" style={{ display: 'none' }} onChange={(event) => uploadFiles(event, 'Document')} multiple/>
                </>,
            liFoo: () => {}
        }
    ]

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
                        <HiMiniPaperClip />
                        <DropDown list={dropDownUpload} state={upload} setState={setUpload}/>
                    </Buttons.DefaultButton>
                    {filesState.files &&
                        <PopupContainer state={filesState.popup} setState={setFilesState}>
                            <PopupInputBlock type={filesState.type} files={filesState.files} setState={setFilesState}></PopupInputBlock>
                        </PopupContainer>
                    }
                </div>
            </div>
            <Buttons.InterButton foo={handleSubmit}>
                <HiOutlinePaperAirplane />
            </Buttons.InterButton>
        </div>
    )
}

export default InputBlock