import {useEffect, useRef, useState} from 'react'
import style from '../style.module.css'
import '../animationWrapper.css'
import {IMessagesResponse} from "@appTypes";
import {Message} from "../message";
import {InputBlock} from "@components/inputBlock";
import CommentsHeader from "../messengerHeader/CommentsHeader";
import userService from "@service/UserService";
import {useParams} from "react-router-dom";
import useFetchInitialData from "@hooks/useFetchInitialData";

const CommentsBlock = () => {
    const [reply, setReply] = useState<IMessagesResponse | null>(null)
    const [channelPost, setChannelPost] = useState<IMessagesResponse | null>(null)
    const {type, messengerId, postId} = useParams()
    const [animation, setAnimation] = useState(false)


    const {
        messenger,
        reactions,
        messagesList,
        setMessagesList,
        socketRef
    } = useFetchInitialData()

    useEffect(() => {
        if (!type || !messengerId || !postId) return

        const controller = new AbortController()
        const signal = controller.signal

        const handlePostFetching = async () => {
            const data = await userService.fetchMessage(messengerId, postId, signal)

            if (data.status === 200) {
                setChannelPost(data.data)
            }
        }
        handlePostFetching()

        return () => {
            controller.abort()
        }
    }, [])

    return (
        <>
            {messenger &&
                <div className={style.ChatContainer}>
                    <CommentsHeader
                        comments_count={channelPost ? channelPost.comments_count : 0}
                        messenger={messenger}
                        setCommentsList={setMessagesList}
                    />
                    <section className={style.MessageBlock}>
                        {channelPost &&
                            <Message
                                message={channelPost}
                                messenger={messenger}
                                socketRoom={`${messengerId}/${postId}`}
                                setReply={setReply}
                                socketRef={socketRef}
                                reactions={reactions}
                            />
                        }
                        {(channelPost && messagesList.length) && messagesList.map(message =>
                            <Message
                                message={message}
                                messenger={{
                                    ...messenger,
                                    type: 'group',
                                }}
                                key={message.message_id}
                                setReply={setReply}
                                socketRoom={`${messengerId}/${postId}`}
                                socketRef={socketRef}
                                reactions={reactions}
                            />
                        )}
                    </section>
                    <InputBlock
                        socketRoom={`${messengerId}/${postId}`}
                        post_id={postId}
                        setReply={setReply}
                        reply={reply}
                        socketRef={socketRef}
                    />
                </div>
            }
        </>
    )
}

export default CommentsBlock