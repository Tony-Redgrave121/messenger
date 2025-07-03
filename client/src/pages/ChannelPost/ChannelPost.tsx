import {useEffect, useState} from 'react'
import style from '../Messenger/style.module.css'
import '../Messenger/animationWrapper.css'
import {Message} from "@entities/Message/ui/message";
import {InputBlock} from "@features/InputBlock";
import ChannelPostHeader from "@widgets/Header/ui/ChannelPostHeader";
import {useParams} from "react-router-dom";
import useFetchInitialData from "@entities/Messenger/lib/hooks/useFetchInitialData";
import {useAbortController} from "@shared/lib";
import {MessageSchema} from "@entities/Message";
import fetchMessageApi from "@entities/Message/api/fetchMessageApi";

const ChannelPost = () => {
    const [reply, setReply] = useState<MessageSchema | null>(null)
    const [channelPost, setChannelPost] = useState<MessageSchema | null>(null)
    const {type, messengerId, postId} = useParams()
    const {getSignal} = useAbortController()

    const {
        messenger,
        reactions,
        messagesList,
        setMessagesList,
        socketRef
    } = useFetchInitialData()

    useEffect(() => {
        if (!type || !messengerId || !postId) return
        const signal = getSignal()

        const handlePostFetching = async () => {
            const data = await fetchMessageApi(messengerId, postId, signal)

            if (data.status === 200) {
                setChannelPost(data.data)
                setMessagesList(prev => [data.data, ...prev])
            }
        }

        handlePostFetching()
    }, [postId])

    return (
        <>
            {messenger &&
                <div className={style.MessengerContainer}>
                    <ChannelPostHeader
                        commentsCount={channelPost ? channelPost.comments_count : 0}
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

export default ChannelPost