import React, {useRef} from 'react'
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
    type?: string,
    inputText: string,
    setInputText: React.Dispatch<React.SetStateAction<string>>,
    handleSubmit: () => void
}

const PopupInputBlock: React.FC<IPopupInputBlock> = ({setState, files, type, inputText, setInputText, handleSubmit}) => {
    const refTextarea = useRef<HTMLTextAreaElement>(null)

    const handleCancel = () => {
        setState(prev => ({...prev, popup: false}))

        setTimeout(() => setState({
            files: null,
            popup: false,
            type: ''
        }), 300)
    }

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <Buttons.DefaultButton foo={handleCancel}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <h1>Send {files.length} files</h1>
                </span>
                <Buttons.DefaultButton>
                    <label htmlFor="addNewFile"><HiOutlineDocumentPlus/></label>
                    {type === 'document' ? <Upload.Document setState={setState}/> : <Upload.Image setState={setState}/>}
                </Buttons.DefaultButton>
            </div>
            {type === 'document' ?
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
                <MediaBlock.InputBlock media={[...files].map(file => ({
                    message_file_id: file.name,
                    message_file_name: URL.createObjectURL(file),
                }))}/>
            }

            <div className={style.SubmitBlock}>
                <TextareaBlock ref={refTextarea} inputText={inputText} setInputText={setInputText}/>
                <button onClick={() => {
                    handleSubmit()
                    handleCancel()
                }}>SEND</button>
            </div>
        </>
    )
}

export default PopupInputBlock