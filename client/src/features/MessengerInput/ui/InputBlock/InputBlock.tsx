import React, { FC } from 'react';
import {
    HiOutlineFaceSmile,
    HiMiniPaperClip,
    HiOutlinePaperAirplane,
    HiOutlineDocument,
    HiOutlineFolderOpen,
    HiOutlineArrowUturnLeft,
    HiOutlineXMark,
} from 'react-icons/hi2';
import useEmojis from '@features/MessengerInput/lib/hooks/useEmojis';
import useInputBlock from '@features/MessengerInput/lib/hooks/useInputBlock';
import InputBlockSchema from '@features/MessengerInput/model/types/InputBlockSchema';
import PopupUpload from '@features/MessengerInput/ui/PopupUpload/PopupUpload';
import { DefaultButton, InterButton, Popup, Textarea, DropDown } from '@shared/ui';
import style from './style.module.css';

const InputBlock: FC<InputBlockSchema> = ({ reply, setReply, socketRef, members }) => {
    const {
        mediaRef,
        documentRef,
        setEmoji,
        emoji,
        refTextarea,
        inputText,
        setInputText,
        setUpload,
        upload,
        filesState,
        handleCancel,
        handleSubmit,
        uploadFiles,
        setFilesState,
        filesRef,
    } = useInputBlock({ reply, setReply, socketRef, members });

    const possiblyEmojis = useEmojis(refTextarea, setInputText);

    const dropDownUpload = [
        {
            liChildren: (
                <>
                    <HiOutlineFolderOpen /> Photo or Video
                </>
            ),
            liFoo: () => mediaRef.current?.click(),
        },
        {
            liChildren: (
                <>
                    <HiOutlineDocument /> Document
                </>
            ),
            liFoo: () => documentRef.current?.click(),
        },
    ];

    return (
        <div className={style.InputContainer}>
            <div className={style.Input}>
                {reply && (
                    <div className={style.ReplyBlock}>
                        <span>
                            <HiOutlineArrowUturnLeft />
                        </span>
                        <button className={style.ReplyMessage}>
                            <h4>Reply to {reply.user.user_name}</h4>
                            <p>
                                {!reply.message_text && reply.message_files
                                    ? 'Media'
                                    : reply.message_text}
                            </p>
                        </button>
                        <DefaultButton foo={() => setReply(null)}>
                            <HiOutlineXMark />
                        </DefaultButton>
                    </div>
                )}
                <div className={style.InputBlock}>
                    <DefaultButton foo={() => setEmoji(!emoji)}>
                        <HiOutlineFaceSmile />
                        <DropDown
                            list={possiblyEmojis}
                            state={emoji}
                            setState={setEmoji}
                            styles={['EmojiContainer']}
                        />
                    </DefaultButton>
                    <Textarea
                        textareaRef={refTextarea}
                        inputText={inputText}
                        setInputText={setInputText}
                    />
                    <DefaultButton foo={() => setUpload(!upload)}>
                        <HiMiniPaperClip />
                        <DropDown list={dropDownUpload} state={upload} setState={setUpload} />
                    </DefaultButton>
                    {filesState.files && (
                        <Popup state={filesState.popup} handleCancel={handleCancel}>
                            <PopupUpload
                                type={filesState.type}
                                files={filesState.files}
                                setState={setFilesState}
                                setInputText={setInputText}
                                inputText={inputText}
                                handleSubmit={handleSubmit}
                                filesRef={filesRef}
                                handleCancel={handleCancel}
                            />
                        </Popup>
                    )}
                </div>
            </div>
            <InterButton foo={handleSubmit}>
                <HiOutlinePaperAirplane />
            </InterButton>
            <label htmlFor="media">
                <input
                    ref={mediaRef}
                    name="media"
                    id="media"
                    type="file"
                    accept="image/*, video/*"
                    onChange={event => uploadFiles(event, 'media')}
                    multiple
                />
            </label>
            <label htmlFor="documentInput">
                <input
                    ref={documentRef}
                    name="document"
                    id="documentInput"
                    type="file"
                    onChange={event => uploadFiles(event, 'document')}
                    multiple
                />
            </label>
        </div>
    );
};

export default InputBlock;
