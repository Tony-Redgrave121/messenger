import React, {useRef, useState} from 'react'
import style from './style.module.css'
import FilesState from "../../../utils/types/FilesState";
import Buttons from "../../buttons/Buttons";
import {HiOutlineDocumentPlus, HiOutlineDocumentText, HiOutlineXMark} from "react-icons/hi2";
import TextareaBlock from "../../textareaBlock/textareaBlock";
import Upload from "./Upload";
import MediaBlock from "../../media/mediaBlock/MediaBlock";

interface IPopupInputBlock {
    setState: React.Dispatch<React.SetStateAction<FilesState>>,
    files: File[],
    type?: string
}

const PopupInputBlock: React.FC<IPopupInputBlock> = ({setState, files, type}) => {
    const [inputText, setInputText] = useState('')
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={() => setState(prev => ({...prev, popup: false}))}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <h1>Send {3} files</h1>
                </span>
                <Buttons.DefaultButton>
                    <label htmlFor="addNewFile"><HiOutlineDocumentPlus/></label>
                    {type === 'Document' ? <Upload.Document setState={setState}/> : <Upload.Image setState={setState}/>}
                </Buttons.DefaultButton>
            </div>
            {type === 'Document' ?
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
                </div> :
                <MediaBlock media={[...files].map(file => (
                    {
                        mediaId: file.name,
                        mediaUrl: URL.createObjectURL(file),
                    }
                ))} />
            }

            <div className={style.SubmitBlock}>
                <TextareaBlock ref={refTextarea} inputText={inputText} setInputText={setInputText}/>
                <button>SEND</button>
            </div>
        </>
    )
}

export default PopupInputBlock