import { clsx } from 'clsx';
import React, { FC, memo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import useMessage from '@features/Message/lib/hooks/useMessage';
import { useMessageContext } from '@features/Message/lib/hooks/useMessageContext';
import CommentLink from '@features/Message/ui/CommentLink/CommentLink';
import DropDownMessage from '@features/Message/ui/Message/DropDownMessage';
import DropDownReactions from '@features/Message/ui/Message/DropDownReactions';
import MessageFiles from '@features/Message/ui/MessageFiles/MessageFiles';
import OwnerLink from '@features/Message/ui/OwnerLink/OwnerLink';
import { ReplyBlock } from '@entities/Message';
import { ReactionsBlock } from '@entities/Reaction';
import { getTime } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from '../message.module.css';
import './message.animation.css';
import OgAttachment from '@entities/Message/ui/OGAttachment/OGAttachment';

interface IMessageProps {
    message: MessageSchema;
}

const Message: FC<IMessageProps> = memo(({ message }) => {
    const [reactionMenu, setReactionMenu] = useState(false);
    const refMessage = useRef<HTMLDivElement>(null);

    const {
        contextMenu,
        setContextMenu,
        animation,
        isOwner,
        position,
        refLink,
        messenger,
        onEntered,
        onContextMenu,
    } = useMessage(message);
    const { socketRef } = useMessageContext();
    const { postId } = useParams();

    return (
        <CSSTransition
            in={animation}
            nodeRef={refMessage}
            timeout={200}
            classNames="message-scale-node"
            unmountOnExit
            onEntered={onEntered}
        >
            <div
                className={clsx(style.MessageContainer, isOwner && style.OwnerMessageContainer)}
                ref={refMessage}
                id={message.message_id}
            >
                <div
                    className={clsx(
                        style.MessageInnerBlock,
                        isOwner && style.OwnerMessageInnerBlock,
                    )}
                >
                    <OwnerLink isOwner={isOwner} message={message} messenger={messenger} />
                    <div className={style.MessageWrapper}>
                        <div
                            className={clsx(
                                style.MessageContent,
                                isOwner && style.OwnerMessageContent,
                                !postId &&
                                    messenger.type === 'channel' &&
                                    style.ChannelMessageContent,
                            )}
                        >
                            <ReplyBlock message={message} />
                            {!isOwner && (
                                <>
                                    {messenger.type !== 'channel' ? (
                                        <Link to={`/chat/${message.user.user_id}`} ref={refLink}>
                                            {message.user.user_name}
                                        </Link>
                                    ) : (
                                        <Link to={''} ref={refLink}>
                                            {messenger.name}
                                        </Link>
                                    )}
                                </>
                            )}
                            <div className={style.MessageBlock} onContextMenu={onContextMenu}>
                                <MessageFiles message={message} />
                                <p>
                                    {message.message_text}
                                    <small>{getTime(message.message_date)}</small>
                                </p>
                                <ReactionsBlock message={message} socketRef={socketRef} />
                                <DropDownMessage
                                    position={position}
                                    message={message}
                                    contextMenu={contextMenu}
                                    setContextMenu={setContextMenu}
                                    setReactionMenu={setReactionMenu}
                                />
                                <DropDownReactions
                                    message={message}
                                    position={position}
                                    setContextMenu={setContextMenu}
                                    reactionMenu={reactionMenu}
                                    setReactionMenu={setReactionMenu}
                                />
                            </div>
                            <OgAttachment text={message.message_text} />
                        </div>
                        <CommentLink messengerType={messenger.type} message={message} />
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
});

Message.displayName = 'Message';

export default Message;
