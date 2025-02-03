import React, {useRef, useState} from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"
import {FilesState} from "../../utils/types/FilesState";
import Buttons from "../buttons/Buttons";
import {HiOutlineDocumentPlus, HiOutlineDocumentText, HiOutlineXMark} from "react-icons/hi2";
import TextareaBlock from "../textareaBlock/textareaBlock";

interface IPopup {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<FilesState>>,
    files: File[],
    children?: React.ReactNode,
}

const Popup: React.FC<IPopup> = ({state, setState, files, children}) => {
    const refDiv = React.useRef<HTMLDivElement>(null)

    const [inputText, setInputText] = useState('')
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    const uploadFiles = (newFiles: FileList) => {
        setState(prev => {
            const existingFiles = prev.files || []
            const filesSet = new Set(existingFiles.map(file => file.name))
            const uniqueFiles = Array.from(newFiles).filter(file => !filesSet.has(file.name))

            return {
                ...prev,
                files: [...existingFiles, ...uniqueFiles]
            }
        })
    }

    return (
        <CSSTransition
            in={state}
            nodeRef={refDiv}
            timeout={300}
            classNames='popup-node'
            unmountOnExit
        >
            <div className={style.PopupContainer} ref={refDiv} onClick={() => setState(prev => ({...prev, popup: false}))}>
                <div onClick={event => event.stopPropagation()}>
                    <div className={style.ToolsBlock}>
                        <span>
                            <Buttons.DefaultButton foo={() => setState(prev => ({...prev, popup: false}))}>
                                <HiOutlineXMark/>
                            </Buttons.DefaultButton>
                            <h1>Send {3} files</h1>
                        </span>
                        <Buttons.DefaultButton>
                            <label htmlFor="images"><HiOutlineDocumentPlus/></label>
                            <input name='images' id='images' type="file" accept='image/*, video/*' style={{display: 'none'}} onChange={(event) => event.target.files && uploadFiles(event.target.files)} multiple/>
                        </Buttons.DefaultButton>
                    </div>
                    <div className={style.FilesBlock}>
                        {[...files].map(file => (
                            <div key={file.name}>
                                <HiOutlineDocumentText/>
                                <div>
                                    <h4>{file.name}</h4>
                                    <p>{(file.size / 1048576).toFixed(2)} MB &#183;</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={style.SubmitBlock}>
                        <TextareaBlock ref={refTextarea} inputText={inputText} setInputText={setInputText}/>
                        <button>SEND</button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Popup