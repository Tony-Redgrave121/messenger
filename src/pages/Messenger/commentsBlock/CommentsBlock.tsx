import React, {Dispatch, FC, memo, SetStateAction, useEffect, useState} from 'react'
import style from '../style.module.css'
import '../animationWrapper.css'
import {IAdaptMessenger, ICommentState, IMessagesResponse, IReaction} from "@appTypes";
import {Message} from "../message";
import {InputBlock} from "@components/inputBlock";
import CommentsHeader from "../messengerHeader/CommentsHeader";
import userService from "@service/UserService";
import {useAppSelector} from "@hooks/useRedux";
import {useParams} from "react-router-dom";
import {useMessageWS} from "@utils/hooks/useMessageWS";

interface ICommentsBlock {
    channelPost: IMessagesResponse,
    messenger: IAdaptMessenger,
    setState: Dispatch<SetStateAction<ICommentState>>,
    reactions?: IReaction[]
}

const CommentsBlock: FC<ICommentsBlock> = memo(({channelPost, messenger, setState, reactions}) => {
    const [reply, setReply] = useState<IMessagesResponse | null>(null)
    const userId = useAppSelector(state => state.user.userId)
    const {type, id} = useParams()

    const {
        socketRef,
        messagesList,
        setMessagesList,
    } = useMessageWS(`${id}/${channelPost.message_id}`)

    useEffect(() => {
        if (!channelPost || !type || !id) return
        let timer: NodeJS.Timeout | null

        const controller = new AbortController()
        const signal = controller.signal

        const handleComments = async () => {
            const data = await userService.fetchMessages(userId, type, id, channelPost.message_id, signal)

            if (data.status === 200) {
                setMessagesList(data.data)
            }
        }

        timer = setTimeout(() => handleComments(), 300)

        return () => {
            controller.abort()
            timer && clearTimeout(timer)
        }
    }, [channelPost])

    return (
        <div className={style.ChatContainer}>
            <CommentsHeader
                comments_count={channelPost ? channelPost.comments_count : 0}
                setState={setState}
                setCommentsList={setMessagesList}
            />
            <section className={style.MessageBlock}>
                <Message
                    message={channelPost}
                    messenger={messenger}
                    setReply={setReply}
                    socketRef={socketRef}
                    reactions={reactions}
                />
                {messagesList.map(message =>
                    <Message
                        message={message}
                        messenger={{
                            ...messenger,
                            type: 'group',
                        }}
                        key={message.message_id}
                        setReply={setReply}
                        socketRef={socketRef}
                        reactions={reactions}
                    />
                )}
            </section>
            <InputBlock
                socketRoom={`${id}/${channelPost.message_id}`}
                post_id={channelPost.message_id}
                setReply={setReply}
                reply={reply}
                socketRef={socketRef}
            />
        </div>
    )
})

export default CommentsBlock