import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {
    HiOutlineFaceSmile,
    HiMiniPaperClip,
    HiOutlinePaperAirplane,
    HiOutlineDocument,
    HiOutlineFolderOpen
} from "react-icons/hi2"
import Buttons from '../buttons/Buttons'
import style from './style.module.css'
import DropDown from "../dropDown/DropDown"
import useEmojis from "./useEmojis"
import Popup from "../popup/Popup";
import {FilesState} from "../../utils/types/FilesState";
import TextareaBlock from "../textareaBlock/textareaBlock";

const InputBlock = () => {
    const [inputText, setInputText] = useState('')
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    const [emoji, setEmoji] = useState(false)
    const emojis = useEmojis(refTextarea, setInputText)

    const [upload, setUpload] = useState(false)
    const [filesState, setFilesState] = useState<FilesState>({
        files: null,
        popup: false
    })

    useEffect(() => {
        if (filesState.files) {
            setFilesState(prev => ({...prev, popup: true}))
        }
    }, [filesState.files])

    const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
        setFilesState(prev => ({...prev, files: Array.from(event.target.files || [])}))
    }

    const dropDownUpload = [
        {
            liChildren:
                <>
                    <label htmlFor="images"><HiOutlineFolderOpen/> Photo or Video</label>
                    <input name='images' id='images'  type="file" accept='image/*, video/*' style={{ display: 'none' }} onChange={(event) => uploadFiles(event)} multiple/>
                </>,
            liFoo: () => {}
        },
        {
            liChildren:
                <>
                    <label htmlFor="documentInput"><HiOutlineDocument/> Document</label>
                    <input name='document' id='documentInput' type="file" style={{ display: 'none' }} onChange={(event) => uploadFiles(event)} multiple/>
                </>,
            liFoo: () => {}
        }
    ]

    return (
        <div className={style.InputContainer}>
            <div className={style.Input}>
                <Buttons.DefaultButton foo={() => setEmoji(!emoji)}>
                    <HiOutlineFaceSmile />
                    <DropDown list={emojis} state={emoji} setState={setEmoji} styles={['EmojiContainer']}/>
                </Buttons.DefaultButton>
                <TextareaBlock ref={refTextarea} inputText={inputText} setInputText={setInputText}/>
                <Buttons.DefaultButton foo={() => setUpload(!upload)}>
                    <HiMiniPaperClip />
                    <DropDown list={dropDownUpload} state={upload} setState={setUpload}/>
                </Buttons.DefaultButton>
                {filesState.files && <Popup files={filesState.files} state={filesState.popup} setState={setFilesState}></Popup>}
            </div>
            <Buttons.InterButton >
                <HiOutlinePaperAirplane />
            </Buttons.InterButton>
        </div>
    )
}

export default InputBlock