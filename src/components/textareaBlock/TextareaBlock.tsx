import React, {useEffect} from 'react'
import style from './style.module.css'

interface ITextareaBlock {
    inputText: string,
    setInputText: (text: string) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const TextareaBlock: React.FC<ITextareaBlock> = ({inputText, setInputText, textareaRef}) => {
    useEffect(() => {
        const curr = textareaRef.current
        if (!curr || !curr.parentElement) return

        curr.style.height = "auto"
        curr.style.height = curr.scrollHeight + "px"
        curr.parentElement.style.height = Number(curr.scrollHeight) + 10 + "px"
    }, [inputText, textareaRef])

    return (
        <textarea
            className={style.Textarea}
            maxLength={850}
            rows={1}
            placeholder="Message"
            ref={textareaRef}
            onChange={event => setInputText(event.target.value)}
        />
    )
}

export default TextareaBlock