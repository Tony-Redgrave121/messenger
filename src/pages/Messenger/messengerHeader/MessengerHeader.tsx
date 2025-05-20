import React, {FC, memo, useRef, useState} from 'react'
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
import {setSidebarLeft} from "@store/reducers/appReducer";
import IAdaptMessenger from "../../../appTypes/IAdaptMessenger";
import {getDate} from "@utils/logic/getDate";

const HeaderLists = {
    chat: [
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
    ],
    group: [
        {
            liChildren: <HiOutlineBellSlash/>,
            liText: 'Mute',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Leave Group',
            liFoo: () => {
            }
        }
    ],
    channel: [
        {
            liChildren: <HiOutlineBellSlash/>,
            liText: 'Mute',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Leave Channel',
            liFoo: () => {
            }
        }
    ]
}

interface IChatHeader {
    messenger: IAdaptMessenger,
    setSidebarState: (state: boolean) => void
}

const MessengerHeader: FC<IChatHeader> = memo(({messenger, setSidebarState}) => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)

    const refSearch = useRef<HTMLDivElement>(null)

    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const dispatch = useAppDispatch()

    const getHeaderDesc = () => {
        switch (messenger.type) {
            case "chat":
                return getDate(messenger.last_seen!)
            case "group":
                return `${messenger.members_count} members`
            case "channel":
                return `${messenger.members_count} subscribers`
            default:
                const exhaustiveCheck: never = messenger.type
                return exhaustiveCheck
        }
    }

    return (
        <header className={style.ChatHeader}>
            <Buttons.DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                <HiOutlineArrowLeft/>
            </Buttons.DefaultButton>
            <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                <LoadFile imagePath={messenger.image ? `${messenger.type !== "chat" ? "messengers" : "users"}/${messenger.id}/${messenger.image}` : ''} imageTitle={messenger.type} key={messenger.id}/>
                <div>
                    <h3>{messenger.name}</h3>
                    <p>{getHeaderDesc()}</p>
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
                    <DropDown list={HeaderLists[messenger.type]} state={settings} setState={setSettings}/>
                </Buttons.DefaultButton>
            </span>
        </header>
    )
})

export default MessengerHeader