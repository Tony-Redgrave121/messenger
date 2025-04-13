import React, {memo, useRef, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {LoadFile} from "@components/loadFile";
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineLockClosed,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {DropDown} from "@components/dropDown"
import {SearchBlock} from "@components/searchBlock"
import {CSSTransition} from 'react-transition-group'
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {IMessengerResponse} from "@appTypes"
import {setSidebarLeft} from "@store/reducers/appReducer";

const list = [
    {
        liChildren: <HiOutlineBellSlash/>,
        liText: 'Mute',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineUserPlus/>,
        liText: 'Add to contacts',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineLockClosed/>,
        liText: 'Block user',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineTrash/>,
        liText: 'Delete Chat',
        liFoo: () => {
        }
    }
]

interface IChatHeader {
    messenger: IMessengerResponse,
    setSidebarState: (state: boolean) => void
}

const ChatHeader: React.FC<IChatHeader> = memo(({messenger, setSidebarState}) => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)

    const refSearch = useRef<HTMLDivElement>(null)

    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const dispatch = useAppDispatch()

    return (
        <header className={style.ChatHeader}>
            <Buttons.DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                <HiOutlineArrowLeft/>
            </Buttons.DefaultButton>
            <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                <LoadFile imagePath={messenger.messenger_image ? `messengers/${messenger.messenger_id}/${messenger.messenger_image}` : ''} imageTitle={messenger.messenger_name} key={messenger.messenger_id}/>
                <div>
                    <h3>{messenger.messenger_name}</h3>
                    <p>{messenger.messenger_type}</p>
                </div>
            </button>
            <span>
                <CSSTransition
                    in={inputState}
                    nodeRef={refSearch}
                    timeout={300}
                    classNames='search-node'
                    unmountOnExit
                >
                    <SearchBlock ref={refSearch} foo={() => {}}/>
                </CSSTransition>
                <Buttons.DefaultButton foo={() => setInputState(!inputState)}>
                    {inputState ? <HiOutlineXMark/> : <HiOutlineMagnifyingGlass/>}
                </Buttons.DefaultButton>
                <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                    <HiEllipsisVertical/>
                    <DropDown list={list} state={settings} setState={setSettings}/>
                </Buttons.DefaultButton>
            </span>
        </header>
    )
})

export default ChatHeader