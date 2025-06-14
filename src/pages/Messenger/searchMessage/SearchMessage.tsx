import React, {Dispatch, FC, memo, SetStateAction, useEffect, useMemo, useRef, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {LoadFile} from "@components/loadFile";
import {
    HiOutlineXMark,
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {SearchBlock} from "@components/searchBlock"
import {CSSTransition} from 'react-transition-group'
import {IAdaptMessenger, IMessagesResponse} from "@appTypes"
import {getDate} from "@utils/logic/getDate"
import debounce from "debounce";
import SearchService from "@service/SearchService";
import {useParams} from "react-router-dom";
import {useAppSelector} from "@hooks/useRedux";
import scrollInto from "@utils/logic/scrollInto";

interface IChatHeader {
    messenger: IAdaptMessenger,
    state: boolean,
    setState: Dispatch<SetStateAction<boolean>>
}

const SearchMessage: FC<IChatHeader> = memo(({messenger, state, setState}) => {
    const [searchRes, setSearchRes] = useState<IMessagesResponse[]>([])
    const [filter, setFilter] = useState('')

    const searchRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<HTMLDivElement>(null)
    const {type, messengerId, postId} = useParams()
    const userId = useAppSelector(state => state.user.userId)

    const searchDebounce = useMemo(() =>
        debounce(async (query: string) => {
            try {
                if (!query || !messengerId || !type) return setSearchRes([])

                const controller = new AbortController()
                const signal = controller.signal

                const params = {
                    query: query,
                    type: type,
                    user_id: userId,
                    messenger_id: messengerId,
                    post_id: postId,
                }

                const res = await SearchService.getMessages(params, signal)

                if (res.status === 200) {
                    const messagesData = res.data
                    setSearchRes(messagesData)
                }
            } catch (e) {
                console.error(e)
            }
        }, 200), [messengerId, userId]
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase()
        setFilter(query)

        searchDebounce(query)
    }

    const highlightWord = (text: string, word: string) => {
        const index = text.toLowerCase().indexOf(word.toLowerCase())
        if (index === -1) return text

        const before = text.slice(0, index)
        const match = text.slice(index, index + word.length)
        const after = text.slice(index + word.length, text.length)

        return (
            <>
                {before}
                <b>{match}</b>
                {after}
            </>
        )
    }

    useEffect(() => {
        setSearchRes([])
    }, [messengerId])

    const onClick = (message_id: string) => {
        setState(false)
        scrollInto(message_id)
        setSearchRes([])
    }

    return (
        <CSSTransition
            in={state}
            nodeRef={animationRef}
            timeout={300}
            classNames='scale-node'
            unmountOnExit
        >
            <div className={style.SearchBlock} ref={animationRef}>
                <div className={style.SearchTopBar}>
                    <SearchBlock ref={searchRef} foo={handleInput}/>
                    <Buttons.DefaultButton foo={() => {
                        setState(false)
                        setSearchRes([])
                    }}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                </div>
                {searchRes.length > 0 &&
                    <div className={style.SearchList}>
                        {searchRes.map(message => (
                            <button key={message.user.user_id + message.message_id} className={style.SearchedMessage} onClick={() => onClick(message.message_id)}>
                                <div className={style.MessageInfo}>
                                    {messenger.type === 'channel' && !postId ?
                                        <LoadFile
                                            imagePath={messenger.image && `messengers/${messenger.id}/${messenger.image}`}
                                            imageTitle={messenger.name}
                                        /> :
                                        <LoadFile
                                            imagePath={message.user.user_img && `users/${message.user.user_id}/${message.user.user_img}`}
                                            imageTitle={message.user.user_name}
                                        />
                                    }
                                    <div className={style.MessageDetail}>
                                        {messenger.type === 'channel' && !postId ?
                                            <p>{messenger.name}</p> :
                                            <p>{message.user.user_name}</p>
                                        }
                                        {message.message_text &&
                                            <p>{highlightWord(message.message_text, filter)}</p>
                                        }
                                    </div>
                                </div>
                                <p>{getDate(message.message_date)}</p>
                            </button>
                        ))}
                    </div>
                }
            </div>
        </CSSTransition>
    )
})

export default SearchMessage