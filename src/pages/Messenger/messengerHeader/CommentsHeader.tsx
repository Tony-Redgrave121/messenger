import React, {Dispatch, FC, memo, SetStateAction, useRef, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {SearchBlock} from "@components/searchBlock"
import {CSSTransition} from 'react-transition-group'
import {ICommentState, IMessagesResponse} from "@appTypes";

interface ICommentsHeader {
    comments_count?: number,
    setState: Dispatch<SetStateAction<ICommentState>>,
    setCommentsList: Dispatch<SetStateAction<IMessagesResponse[]>>,
}

const CommentsHeader: FC<ICommentsHeader> = memo(({comments_count, setState, setCommentsList}) => {
    const [inputState, setInputState] = useState(false)
    const refSearch = useRef<HTMLDivElement>(null)

    const handleClose = () => {
        let timer: NodeJS.Timeout | null

        setState(prev => ({
            ...prev,
            commentState: false
        }))

        timer = setTimeout(() => setCommentsList([]), 300)

        return () => {
            timer && clearTimeout(timer)
        }
    }

    return (
        <header className={style.ChatHeader}>
            <Buttons.DefaultButton foo={handleClose}>
                <HiOutlineArrowLeft/>
            </Buttons.DefaultButton>
            <p>{comments_count} Comments</p>
            <span>
                <CSSTransition
                    in={inputState}
                    nodeRef={refSearch}
                    timeout={300}
                    classNames='scale-node'
                    unmountOnExit
                >
                    <SearchBlock ref={refSearch} foo={() => {}}/>
                </CSSTransition>
                <Buttons.DefaultButton foo={() => setInputState(!inputState)}>
                    {inputState ? <HiOutlineXMark/> : <HiOutlineMagnifyingGlass/>}
                </Buttons.DefaultButton>
            </span>
        </header>
    )
})

export default CommentsHeader