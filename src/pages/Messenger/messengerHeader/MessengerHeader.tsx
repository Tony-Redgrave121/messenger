import {FC, memo, useState} from 'react'
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
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {DropDown} from "@components/dropDown"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {setSidebarLeft} from "@store/reducers/appReducer";
import {IAdaptMessenger} from "@appTypes";
import {getDate} from "@utils/logic/getDate";
import {clsx} from "clsx";
import SearchMessage from "../searchMessage/SearchMessage";

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
        <header className={clsx(style.ChatHeader, style.MainHeader)}>
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
            <SearchMessage
                state={inputState}
                setState={setInputState}
            />
            <span>
                <Buttons.DefaultButton foo={() => setInputState(true)}>
                    <HiOutlineMagnifyingGlass/>
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