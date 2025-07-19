import React, { useState } from 'react';
import { PostHeader } from '@widgets/Header';
import useFetchInitialData from '@widgets/Messenger/lib/hooks/useFetchInitialData';
import useFetchPost from '@widgets/Messenger/lib/hooks/useFetchPost';
import { Message, MessagesList } from '@features/Message';
import { InputBlock } from '@features/MessengerInput';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

const Post = () => {
    const [reply, setReply] = useState<MessageSchema | null>(null);

    const { messenger, reactions, messagesList, setMessagesList, socketRef } =
        useFetchInitialData();
    const { channelPost } = useFetchPost(setMessagesList);

    return (
        <div className={style.MessengerContainer}>
            <PostHeader commentsCount={channelPost?.comments_count ?? 0} messenger={messenger} />
            {channelPost && (
                <section className={style.MessageBlock}>
                    <Message
                        message={channelPost}
                        messenger={{ ...messenger, type: 'channel' }}
                        key={channelPost.message_id}
                        setReply={setReply}
                        socketRef={socketRef}
                        reactions={reactions}
                    />
                    <MessagesList
                        messagesList={messagesList.slice(1)}
                        messenger={{ ...messenger, type: 'group' }}
                        setReply={setReply}
                        socketRef={socketRef}
                        reactions={reactions}
                    />
                </section>
            )}
            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef} />
        </div>
    );
};

export default Post;
