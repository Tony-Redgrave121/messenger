import {useEffect, useState} from 'react'
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
                setMessagesList(prev => [data.data, ...prev])
            }
        }
        handlePostFetching()

        return () => {
            controller.abort()
        }
    }, [postId])

    return (
        <>
            {messenger &&
                <div className={style.MessengerContainer}>
                    <CommentsHeader
                        comments_count={channelPost ? channelPost.comments_count : 0}
                        messenger={messenger}
                    />
                    <section className={style.MessageBlock}>
                        {(channelPost && messagesList.length) && messagesList.map((message, index) =>
                            <Message
                                message={message}
                                messenger={{
                                    ...messenger,
                                    type: index ? 'group' : 'channel',
                                }}
                                key={message.message_id}
                                setReply={setReply}
                                socketRef={socketRef}
                                reactions={reactions}
                            />
                        )}
                    </section>
                    <InputBlock
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