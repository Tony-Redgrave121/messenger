import React, {Dispatch, FC, memo, SetStateAction, useEffect, useState} from 'react'
import style from '../style.module.css'
import '../animationWrapper.css'
import {IAdaptMessenger, IMessagesResponse} from "@appTypes";
import {Message} from "../message";
import {InputBlock} from "@components/inputBlock";
import CommentsHeader from "../messengerHeader/CommentsHeader";
import {useCommentWS} from "@utils/hooks/useCommentWS";

interface ICommentsBlock {
    channelPost: IMessagesResponse,
    messenger: IAdaptMessenger,
    setState: Dispatch<SetStateAction<IMessagesResponse | null>>
}

const CommentsBlock: FC<ICommentsBlock> = memo(({channelPost, messenger, setState}) => {
    const [reply, setReply] = useState<IMessagesResponse | null>(null)

    const {
        socketRef,
        commentsList,
        setCommentsList,
    } = useCommentWS()

    useEffect(() => {
        setCommentsList(prev => [channelPost, ...prev])
    }, [])

    return (
        <div className={style.ChatContainer}>
            <CommentsHeader comments_count={channelPost.comments_count} setState={setState}/>
            <section className={style.MessageBlock}>
                {commentsList.map(message =>
                    <Message
                        message={message}
                        messenger={messenger}
                        key={message.message_id}
                        setReply={setReply}
                        socketRef={socketRef}
                    />
                )}
            </section>
            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef}/>
        </div>
    )
})

export default CommentsBlock