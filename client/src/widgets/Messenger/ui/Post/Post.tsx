import React, { FC, ReactNode, useState } from 'react';
import useFetchPost from '@widgets/Messenger/lib/hooks/useFetchPost';
import { useFetchInitialData } from '@features/EditMessenger';
import { MessagesList } from '@features/Message';
import { InputBlock } from '@features/MessengerInput';
import { MessageSchema } from '@shared/types';
import style from '../messenger.module.css';

interface IPostProps {
    children?: ReactNode;
}

const Post: FC<IPostProps> = ({ children }) => {
    const [reply, setReply] = useState<MessageSchema | null>(null);

    const { messenger, reactions, messagesList, setMessagesList, socketRef } =
        useFetchInitialData();
    const { channelPost } = useFetchPost(setMessagesList);

    return (
        <div className={style.MessengerContainer}>
            {children}
            {channelPost && (
                <section className={style.MessageBlock}>
                    <MessagesList
                        messagesList={[channelPost]}
                        messenger={{ ...messenger, type: 'channel' }}
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
