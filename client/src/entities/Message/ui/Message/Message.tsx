import { clsx } from 'clsx';
import {
    Dispatch,
    FC,
    memo,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineTrash,
    HiOutlineFlag,
    HiOutlineChevronRight,
    HiOutlineFire,
} from 'react-icons/hi2';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './message.animation.css';
import { setWrapperState } from '@widgets/Main/model/slice/wrapperSlice';
import { DocumentBlock } from '@features/DocumentBlock';
import { MessageMediaBlock } from '@features/MessageMediaBlock';
import MessageFileSchema from '@entities/Media/model/types/MessageFileSchema';
import deleteMessageApi from '@entities/Message/api/deleteMessageApi';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';
import { ReactionSchema, ReactionsBlock } from '@entities/Reaction';
import {
    useAppDispatch,
    useAppSelector,
    getTitle,
    contextMenu,
    scrollInto,
    getTime,
} from '@shared/lib';
import { DropDown } from '@shared/ui/DropDown';
import { LoadFile } from '@shared/ui/LoadFile';
import useReaction from '../../../Reaction/lib/hooks/useReaction';
import checkRights from '../../../User/lib/CheckRights/checkRights';
import { MessageSchema } from '../../index';
import useCopy from '../../lib/hooks/useCopy';
import style from './style.module.css';

interface IMessageProps {
    message: MessageSchema;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    socketRef: RefObject<WebSocket | null>;
    messenger: AdaptMessengerSchema;
    reactions?: ReactionSchema[];
}

const Message: FC<IMessageProps> = memo(
    ({ message, setReply, socketRef, messenger, reactions }) => {
        const [contextMenuState, setContextMenuState] = useState(false);
        const [reactionMenu, setReactionMenu] = useState(false);
        const [animateMessage, setAnimateMessage] = useState(false);
        const [isOwner, setIsOwner] = useState(false);

        const [position, setPosition] = useState({ x: 0, y: 0 });

        const refMessage = useRef<HTMLDivElement>(null);
        const refLink = useRef<HTMLAnchorElement>(null);

        const [mediaArr, setMediaArr] = useState<MessageFileSchema[]>([]);
        const user_id = useAppSelector(state => state.user.userId);
        const dispatch = useAppDispatch();
        const navigate = useNavigate();

        const { messengerId, postId } = useParams();
        const { handleCopy } = useCopy();

        const handleDelete = useCallback(async () => {
            if (!messengerId) return;
            const messageDelete = await deleteMessageApi(message.message_id);

            if (messageDelete && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                        user_id: user_id,
                        method: 'REMOVE_MESSAGE',
                        data: messageDelete.data,
                    }),
                );
            }
        }, [messengerId, postId, message.message_id, socketRef, user_id]);

        const dropDownOptions = {
            react: {
                liChildren: <HiOutlineFire />,
                liText: 'Reactions',
                liFoo: () => {
                    setReactionMenu(true);
                    setContextMenuState(false);
                },
            },
            copy: {
                liChildren: <HiOutlineDocumentDuplicate />,
                liText: 'Copy',
                liFoo: () => {
                    handleCopy(message?.message_text || '', 'Text copied to clipboard');
                    setContextMenuState(false);
                },
            },
            reply: {
                liChildren: <HiOutlineArrowUturnLeft />,
                liText: 'Reply',
                liFoo: () => {
                    setReply(message);
                    setContextMenuState(false);
                },
            },
            delete: {
                liChildren: <HiOutlineTrash />,
                liText: 'Delete',
                liFoo: () => {
                    handleDelete().catch(e => console.error(e));
                    setContextMenuState(false);
                },
            },
            report: {
                liChildren: <HiOutlineFlag />,
                liText: 'Report',
                liFoo: () => {
                    setContextMenuState(false);
                },
            },
        };

        const handleDropDown = () => {
            let list = [];

            const baseOptions = [dropDownOptions.copy];
            if (reactions) baseOptions.push(dropDownOptions.react);

            switch (messenger.type) {
                case 'chat':
                    if (message.user_id === user_id)
                        list = [...baseOptions, dropDownOptions.reply, dropDownOptions.delete];
                    else list = [...baseOptions, dropDownOptions.reply];
                    break;
                case 'group':
                    if (message.user_id === user_id || checkRights(messenger.members!, user_id))
                        list = [...baseOptions, dropDownOptions.reply, dropDownOptions.delete];
                    else list = [...baseOptions, dropDownOptions.reply];
                    break;
                case 'channel':
                    if (checkRights(messenger.members!, user_id))
                        list = [...baseOptions, dropDownOptions.report, dropDownOptions.delete];
                    else list = [...baseOptions, dropDownOptions.report];
                    break;
            }

            return (
                <DropDown
                    list={list}
                    state={contextMenuState}
                    setState={setContextMenuState}
                    position={position}
                />
            );
        };

        const { reactionOnClick } = useReaction();

        const handleReactions = () => {
            const reactionList = reactions?.map(reaction => ({
                liChildren: reaction.reaction_code,
                liFoo: async () => {
                    await reactionOnClick(message, reaction, socketRef);

                    setContextMenuState(false);
                    setReactionMenu(false);
                },
            }));

            return (
                reactionList && (
                    <DropDown
                        list={reactionList}
                        state={reactionMenu}
                        setState={setReactionMenu}
                        position={position}
                        styles={['EmojiContainer']}
                    />
                )
            );
        };

        const commentsOnClick = () => {
            dispatch(setWrapperState(false));

            setTimeout(() => {
                navigate(`/channel/${messenger.id}/post/${message.message_id}`);
                dispatch(setWrapperState(true));
            }, 200);
        };

        useEffect(() => {
            const timeout = setTimeout(() => setAnimateMessage(true), 200);
            setIsOwner(message.user_id === user_id && messenger.type !== 'channel');

            return () => clearTimeout(timeout);
        }, []);

        const onEntered = () => {
            getTitle(refLink, message.user.user_name, 'color');
        };

        useEffect(() => {
            if (message.message_files && message.message_type === 'media') {
                setMediaArr(message.message_files);
            }
        }, [message.message_files, message.message_type]);

        return (
            <CSSTransition
                in={animateMessage}
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
                        {!isOwner && (
                            <Link
                                className={style.UserAvatarLink}
                                to={
                                    messenger.type !== 'channel'
                                        ? `/chat/${message.user.user_id}`
                                        : ''
                                }
                            >
                                {messenger.type === 'channel' ? (
                                    <LoadFile
                                        imagePath={
                                            messenger.image &&
                                            `messengers/${messenger.id}/${messenger.image}`
                                        }
                                        imageTitle={messenger.name}
                                    />
                                ) : (
                                    <LoadFile
                                        imagePath={
                                            message.user.user_img &&
                                            `users/${message.user.user_id}/${message.user.user_img}`
                                        }
                                        imageTitle={message.user.user_name}
                                    />
                                )}
                            </Link>
                        )}
                        <div className={style.MessageWrapper}>
                            <div
                                className={clsx(
                                    style.MessageContent,
                                    isOwner && style.OwnerMessageContent,
                                    messenger.type === 'channel' &&
                                        !postId &&
                                        style.ChannelMessageContent,
                                )}
                            >
                                {message.reply && (
                                    <button
                                        className={style.ReplyBlock}
                                        onClick={() => scrollInto(message.reply!.message_id)}
                                    >
                                        <p>{message.reply.user.user_name}</p>
                                        <p>{message.reply.message_text}</p>
                                    </button>
                                )}
                                {!isOwner && (
                                    <>
                                        {messenger.type !== 'channel' ? (
                                            <Link
                                                to={`/chat/${message.user.user_id}`}
                                                ref={refLink}
                                            >
                                                {message.user.user_name}
                                            </Link>
                                        ) : (
                                            <Link to={''} ref={refLink}>
                                                {messenger.name}
                                            </Link>
                                        )}
                                    </>
                                )}
                                <div
                                    className={style.MessageBlock}
                                    onContextMenu={event =>
                                        contextMenu({
                                            event,
                                            setPosition,
                                            setContextMenuState,
                                            height: 100,
                                        })
                                    }
                                >
                                    {mediaArr.length > 0 && (
                                        <MessageMediaBlock
                                            media={mediaArr}
                                            messageId={message.message_id}
                                        />
                                    )}
                                    {message.message_files &&
                                        message.message_type === 'document' && (
                                            <div className={style.DocumentBlock}>
                                                {message.message_files.map(doc => (
                                                    <DocumentBlock
                                                        doc={doc}
                                                        key={doc.message_file_id}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    <p>
                                        {message.message_text}
                                        <small>{getTime(message.message_date)}</small>
                                    </p>
                                    {message.reactions && message.reactions.length > 0 && (
                                        <ReactionsBlock message={message} socketRef={socketRef} />
                                    )}
                                    {handleDropDown()}
                                    {handleReactions()}
                                </div>
                            </div>
                            {messenger.type === 'channel' && !postId && (
                                <div className={style.CommentsContainer} onClick={commentsOnClick}>
                                    <p>{message?.comments_count || 0} Comments</p>
                                    <HiOutlineChevronRight />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CSSTransition>
        );
    },
);

Message.displayName = 'Message';

export default Message;
