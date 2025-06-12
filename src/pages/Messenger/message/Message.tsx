import {
    Dispatch,
    FC,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import style from "./style.module.css"
import {Slider} from "@components/slider";
import {MediaBlock} from "@components/media";
import {getTime} from "@utils/logic/getDate";
import {
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineTrash, HiOutlineFlag, HiOutlineChevronRight, HiOutlineFire
} from "react-icons/hi2"
import {IMessagesResponse, IMessageFile, IAdaptMessenger, IReaction} from "@appTypes";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {DropDown} from "@components/dropDown";
import {DocumentBlock} from "./index";
import UserService from "@service/UserService";
import {Link, useNavigate, useParams} from "react-router-dom";
import handleContextMenu from "@utils/logic/handleContextMenu";
import {CSSTransition} from 'react-transition-group'
import './animation.css'
import checkRights from "@utils/logic/checkRights";
import {LoadFile} from "@components/loadFile";
import {clsx} from 'clsx'
import getTitle from "@utils/logic/getTitle";
import ReactionsBlock from "./reactionsBlock/ReactionsBlock";
import useReaction from "@utils/hooks/useReaction";
import scrollInto from "@utils/logic/scrollInto";
import {setWrapperState} from "@store/reducers/appReducer";

interface IMessageProps {
    message: IMessagesResponse,
    setReply: Dispatch<SetStateAction<IMessagesResponse | null>>,
    socketRef: RefObject<WebSocket | null>,
    messenger: IAdaptMessenger,
    reactions?: IReaction[],
}

const initialCurrMedia: IMessageFile = {
    message_file_id: '',
    message_file_name: '',
    message_file_size: 0,
    message_file_path: ''
}

const Message: FC<IMessageProps> = (
    {
        message,
        setReply,
        socketRef,
        messenger,
        reactions
    }
) => {
    const [contextMenu, setContextMenu] = useState(false)
    const [reactionMenu, setReactionMenu] = useState(false)
    const [animateMessage, setAnimateMessage] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    const [position, setPosition] = useState({x: 0, y: 0})
    const [currMedia, setCurrMedia] = useState(initialCurrMedia)

    const refSlider = useRef<HTMLDivElement>(null)
    const refMessage = useRef<HTMLDivElement>(null)
    const refLink = useRef<HTMLAnchorElement>(null)

    const [mediaArr, setMediaArr] = useState<IMessageFile[]>([])
    const user_id = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {messengerId, postId} = useParams()

    const [slider, setSlider] = useState({
        state: false,
        mounted: false
    })

    const handleDelete = useCallback(async () => {
        if (!messengerId) return
        const messageDelete = await UserService.deleteMessage(message.message_id)

        if (messageDelete && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                user_id: user_id,
                method: 'REMOVE_MESSAGE',
                data: messageDelete.data
            }))
        }
    }, [messengerId, postId, message.message_id, socketRef, user_id])

    const dropDownOptions = {
        react: {
            liChildren: <HiOutlineFire/>,
            liText: 'Reactions',
            liFoo: () => {
                setReactionMenu(true)
                setContextMenu(false)
            }
        },
        copy: {
            liChildren: <HiOutlineDocumentDuplicate/>,
            liText: 'Copy',
            liFoo: () => {
                message.message_text && window.navigator.clipboard.writeText(message.message_text)
                setContextMenu(false)
            }
        },
        reply: {
            liChildren: <HiOutlineArrowUturnLeft/>,
            liText: 'Reply',
            liFoo: () => {
                setReply(message)
                setContextMenu(false)
            }
        },
        delete: {
            liChildren: <HiOutlineTrash/>,
            liText: 'Delete',
            liFoo: () => {
                handleDelete().catch(e => console.error(e))
                setContextMenu(false)
            }
        },
        report: {
            liChildren: <HiOutlineFlag/>,
            liText: 'Report',
            liFoo: () => {
                setContextMenu(false)
            }
        }
    }

    const handleDropDown = () => {
        let list = []

        const baseOptions = [dropDownOptions.copy]
        reactions && baseOptions.push(dropDownOptions.react)

        switch (messenger.type) {
            case "chat":
                if (message.user_id === user_id) list = [
                    ...baseOptions,
                    dropDownOptions.reply,
                    dropDownOptions.delete
                ]
                else list = [
                    ...baseOptions,
                    dropDownOptions.reply,
                ]
                break
            case "group":
                if (message.user_id === user_id || checkRights(messenger.members!, user_id)) list = [
                    ...baseOptions,
                    dropDownOptions.reply,
                    dropDownOptions.delete
                ]
                else list = [
                    ...baseOptions,
                    dropDownOptions.reply,
                ]
                break
            case "channel":
                if (checkRights(messenger.members!, user_id)) list = [
                    ...baseOptions,
                    dropDownOptions.report,
                    dropDownOptions.delete
                ]
                else list = [
                    ...baseOptions,
                    dropDownOptions.report
                ]
                break
        }

        return <DropDown
            list={list}
            state={contextMenu}
            setState={setContextMenu}
            position={position}
        />
    }

    const {reactionOnClick} = useReaction()

    const handleReactions = () => {
        const reactionList = reactions?.map(reaction => ({
            liChildren: reaction.reaction_code,
            liFoo: async () => {
                await reactionOnClick(message, reaction, socketRef)

                setContextMenu(false)
                setReactionMenu(false)
            }
        }))

        return reactionList && <DropDown
            list={reactionList}
            state={reactionMenu}
            setState={setReactionMenu}
            position={position}
            styles={['EmojiContainer']}
        />
    }

    const commentsOnClick = () => {
        dispatch(setWrapperState(false))

        setTimeout(() => {
            navigate(`/channel/${messenger.id}/post/${message.message_id}`)
            dispatch(setWrapperState(true))
        }, 200)
    }

    useEffect(() => {
        const timeout = setTimeout(() => setAnimateMessage(true), 200)
        setIsOwner(message.user_id === user_id && messenger.type !== "channel")

        return () => clearTimeout(timeout)
    }, [])

    const onEntered = () => {
        getTitle(refLink, message.user.user_name, 'color')
    }

    useEffect(() => {
        if (message.message_files && message.message_type === 'media') {
            setMediaArr(message.message_files)
            setCurrMedia(message.message_files[0])
        }
    }, [message.message_files, message.message_type])

    return (
        <CSSTransition
            in={animateMessage}
            nodeRef={refMessage}
            timeout={200}
            classNames='message-scale-node'
            unmountOnExit
            onEntered={onEntered}
        >
            <div className={clsx(style.MessageContainer, isOwner && style.OwnerMessageContainer)} ref={refMessage}
                 id={message.message_id}>
                <div className={clsx(style.MessageInnerBlock, isOwner && style.OwnerMessageInnerBlock)}>
                    {!isOwner &&
                        <Link className={style.UserAvatarLink}
                              to={messenger.type !== 'channel' ? `/chat/${message.user.user_id}` : ''}>
                            {messenger.type === 'channel' ?
                                <LoadFile
                                    imagePath={messenger.image && `messengers/${messenger.id}/${messenger.image}`}
                                    imageTitle={messenger.name}
                                /> :
                                <LoadFile
                                    imagePath={message.user.user_img && `users/${message.user.user_id}/${message.user.user_img}`}
                                    imageTitle={message.user.user_name}
                                />
                            }
                        </Link>
                    }
                    <div className={style.MessageWrapper}>
                        <div
                            className={clsx(style.MessageContent, isOwner && style.OwnerMessageContent, (messenger.type === 'channel' && !postId) && style.ChannelMessageContent)}>
                            {message.reply &&
                                <button className={style.ReplyBlock}
                                        onClick={() => scrollInto(message.reply!.message_id)}>
                                    <p>{message.reply.user.user_name}</p>
                                    <p>{message.reply.message_text}</p>
                                </button>
                            }
                            {!isOwner &&
                                <>
                                    {messenger.type !== 'channel' ?
                                        <Link to={`/chat/${message.user.user_id}`} ref={refLink}>
                                            {message.user.user_name}
                                        </Link> :
                                        <Link to={''} ref={refLink}>
                                            {messenger.name}
                                        </Link>
                                    }
                                </>
                            }
                            <div className={style.MessageBlock} onContextMenu={(event) => handleContextMenu({
                                event,
                                setPosition,
                                setContextMenu,
                                height: 100
                            })}>
                                {(mediaArr.length > 0) &&
                                    <MediaBlock.MessageMedia
                                        media={mediaArr}
                                        setSlider={setSlider}
                                        setCurrMedia={setCurrMedia}
                                    />
                                }
                                {(message.message_files && message.message_type === 'document') &&
                                    <div className={style.DocumentBlock}>
                                        {message.message_files.map(doc =>
                                            <DocumentBlock
                                                doc={doc}
                                                key={doc.message_file_id}
                                            />
                                        )}
                                    </div>
                                }
                                <p>
                                    {message.message_text}
                                    <small>{getTime(message.message_date)}</small>
                                </p>
                                {message.reactions && message.reactions.length > 0 &&
                                    <ReactionsBlock message={message} socketRef={socketRef}/>
                                }
                                {handleDropDown()}
                                {handleReactions()}
                            </div>
                        </div>
                        {messenger.type === 'channel' && !postId &&
                            <div className={style.CommentsContainer} onClick={commentsOnClick}>
                                <p>{message.comments_count} Comments</p>
                                <HiOutlineChevronRight/>
                            </div>
                        }
                    </div>
                </div>
                {slider.mounted && mediaArr &&
                    <Slider animation={{
                        state: slider.state,
                        setState: setSlider,
                        ref: refSlider
                    }} media={{
                        mediaArr: mediaArr,
                        setMediaArr: setMediaArr,
                        currentSlide: currMedia
                    }} user={{
                        owner_id: message.user.user_id,
                        owner_image: message.user.user_img,
                        owner_name: message.user.user_name,
                        message_date: message.message_date
                    }}
                    />
                }
            </div>
        </CSSTransition>
    )
}

export default Message