import React, {useEffect} from 'react'

interface ITextareaBlock {
    inputText: string, 
    setInputText: (text: string) => void,
    ref: React.RefObject<HTMLTextAreaElement | null>
}

const TextareaBlock: React.FC<ITextareaBlock> = ({inputText, setInputText, ref}) => {
    useEffect(() => {
        const curr = ref.current
        if (!curr || !curr.parentElement) return
        
        curr.style.height = "auto"
        curr.style.height = curr.scrollHeight + "px"
        curr.parentElement.style.height = Number(curr.scrollHeight) + 10 + "px"
    }, [inputText, ref])

    return (
        <textarea maxLength={850} rows={1} placeholder="Message" ref={ref} onChange={event => setInputText(event.target.value)}/>
    )
}

export default TextareaBlock