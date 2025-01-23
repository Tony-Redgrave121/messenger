import React, {useEffect, useRef, useState} from 'react'
import { HiOutlineFaceSmile, HiMiniPaperClip } from "react-icons/hi2"
import Buttons from '../buttons/Buttons'
import style from './style.module.css'

const InputBlock = () => {
    const refTextarea = useRef<HTMLTextAreaElement>(null)
    const [inputText, setInputText] = useState('')

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
            <Buttons.DefaultButton>
                <HiOutlineFaceSmile />
            </Buttons.DefaultButton>
            <textarea maxLength={850} rows={1} placeholder="Message" ref={refTextarea} onChange={event => setInputText(event.target.value)} />
            <Buttons.DefaultButton>
                <HiMiniPaperClip />
            </Buttons.DefaultButton>
        </div>
    )
}

export default InputBlock