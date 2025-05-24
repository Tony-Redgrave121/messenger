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
import {IMessagesResponse} from "@appTypes";

interface ICommentsHeader {
    comments_count?: number,
    setState: Dispatch<SetStateAction<IMessagesResponse | null>>
}

const CommentsHeader: FC<ICommentsHeader> = memo(({comments_count, setState}) => {
    const [inputState, setInputState] = useState(false)
    const refSearch = useRef<HTMLDivElement>(null)

    return (
        <header className={style.ChatHeader}>
            <Buttons.DefaultButton foo={() => setState(null)}>
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