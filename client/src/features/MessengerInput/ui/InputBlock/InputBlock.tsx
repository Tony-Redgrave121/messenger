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
                        <DefaultButton foo={() => setReply(null)} ariaLabel="Back">
                            <HiOutlineXMark />
                        </DefaultButton>
                    </div>
                )}
                <div className={style.InputBlock}>
                    <div className={style.DropDownBlock}>
                        <DefaultButton foo={() => setEmoji(!emoji)} ariaLabel="Open emoji">
                            <HiOutlineFaceSmile />
                        </DefaultButton>
                        <DropDown
                            list={possiblyEmojis}
                            state={emoji}
                            setState={setEmoji}
                            styles={['EmojiContainer']}
                        />
                    </div>
                    <Textarea
                        textareaRef={refTextarea}
                        inputText={inputText}
                        setInputText={setInputText}
                    />
                    <div className={style.DropDownBlock}>
                        <DefaultButton
                            foo={() => setUpload(!upload)}
                            ariaLabel="Attach files to a message"
                        >
                            <HiMiniPaperClip />
                        </DefaultButton>
                        <DropDown list={dropDownUpload} state={upload} setState={setUpload} />
                    </div>
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
            <InterButton foo={handleSubmit} ariaLabel="Send a message">
                <HiOutlinePaperAirplane />
            </InterButton>
            <input
                ref={mediaRef}
                name="media"
                id="media"
                type="file"
                accept="image/*, video/*"
                onChange={event => uploadFiles(event, 'media')}
                multiple
                aria-label="media"
            />
            <input
                ref={documentRef}
                name="document"
                id="documentInput"
                type="file"
                onChange={event => uploadFiles(event, 'document')}
                multiple
                aria-label="documentInput"
            />
        </div>
    );
};

export default InputBlock;
