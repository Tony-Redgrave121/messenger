import React, {useEffect, useRef, useState} from 'react'
import {
    HiOutlineFaceSmile,
    HiMiniPaperClip,
    HiOutlinePaperAirplane,
    HiOutlineDocument,
    HiOutlineFolderOpen
} from "react-icons/hi2"
import Buttons from '../buttons/Buttons'
import style from './style.module.css'
import Popup from "../popup/Popup"
import useEmojis from "./useEmojis"

const list2 = [
    {
        liIcon: <HiOutlineFolderOpen/>,
        liText: 'Photo or Video',
        liFoo: () => {
        }
    },
    {
        liIcon: <HiOutlineDocument/>,
        liText: 'Document',
        liFoo: () => {
        }
    }
]

const InputBlock = () => {
    const refTextarea = useRef<HTMLTextAreaElement>(null)
    const [inputText, setInputText] = useState('')
    const [file, setFile] = useState(false)
    const [emoji, setEmoji] = useState(false)
    const emojis = useEmojis(refTextarea, setInputText)

    useEffect(() => {
        const curr = refTextarea.current

        if (curr) {
            curr.style.height = "auto"
            curr.style.height = curr.scrollHeight + "px"
            curr.parentElement!.style.height = Number(curr.scrollHeight) + 10 + "px"
        }
    }, [inputText])

    return (
        <div className={style.InputContainer}>
            <div className={style.Input}>
                <Buttons.DefaultButton foo={() => setEmoji(!emoji)}>
                    <HiOutlineFaceSmile />
                    <Popup list={emojis} state={emoji} setState={setEmoji} styles={['EmojiContainer']}/>
                </Buttons.DefaultButton>
                <textarea maxLength={850} rows={1} placeholder="Message" ref={refTextarea} onChange={event => setInputText(event.target.value)} />
                <Buttons.DefaultButton foo={() => setFile(!file)}>
                    <HiMiniPaperClip />
                    <Popup list={list2} state={file} setState={setFile}/>
                </Buttons.DefaultButton>
            </div>
            <Buttons.InterButton >
                <HiOutlinePaperAirplane />
            </Buttons.InterButton>
        </div>
    )
}

export default InputBlock