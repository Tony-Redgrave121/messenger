import React, { Dispatch, FC, RefObject, SetStateAction, useRef } from 'react';
import { HiOutlineDocumentPlus, HiOutlineDocumentText, HiOutlineXMark } from 'react-icons/hi2';
import UploadMediaBlock from '@features/MessengerInput/ui/UploadMediaBlock/UploadMediaBlock';
import { UploadMedia, UploadDocument } from '@entities/Media';
import { FileStateSchema, FileObjectSchema } from '@shared/types';
import { DefaultButton, Textarea } from '@shared/ui';
import style from './style.module.css';

interface IPopupInputBlock {
    setState: Dispatch<SetStateAction<FileStateSchema>>;
    files: FileObjectSchema[];
    type?: string;
    inputText: string;
    setInputText: Dispatch<SetStateAction<string>>;
    handleSubmit: () => void;
    filesRef: RefObject<File[] | null>;
    handleCancel: () => void;
}

const PopupUpload: FC<IPopupInputBlock> = ({
    setState,
    files,
    type,
    inputText,
    setInputText,
    handleSubmit,
    filesRef,
    handleCancel,
}) => {
    const refTextarea = useRef<HTMLTextAreaElement>(null);

    return (
        <>
            <div className={style.ToolsBlock}>
                <span>
                    <DefaultButton foo={handleCancel}>
                        <HiOutlineXMark />
                    </DefaultButton>
                    <h1>Send {files.length} files</h1>
                </span>
                <DefaultButton foo={() => {}}>
                    <label htmlFor="addNewFile">
                        <HiOutlineDocumentPlus />
                    </label>
                    {type === 'document' ? (
                        <UploadDocument setState={setState} filesRef={filesRef} />
                    ) : (
                        <UploadMedia setState={setState} filesRef={filesRef} />
                    )}
                </DefaultButton>
            </div>
            {type === 'document' ? (
                <div className={style.FilesBlock}>
                    {[...files].map(file => (
                        <div key={file.name}>
                            <HiOutlineDocumentText />
                            <div>
                                <h4>{file.name}</h4>
                                <p>{(file.size / 1048576).toFixed(2)} MB &#183;</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <UploadMediaBlock media={files} />
            )}
            <div className={style.SubmitBlock}>
                <Textarea
                    textareaRef={refTextarea}
                    inputText={inputText}
                    setInputText={setInputText}
                />
                <button
                    onClick={() => {
                        handleSubmit();
                        handleCancel();
                    }}
                >
                    SEND
                </button>
            </div>
        </>
    );
};

export default PopupUpload;
