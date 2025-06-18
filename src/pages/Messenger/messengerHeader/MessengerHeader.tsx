import {Dispatch, FC, memo, SetStateAction, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {LoadFile} from "@components/loadFile";
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineArrowLeft, HiOutlineUserMinus
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {DropDown} from "@components/dropDown"
import {useAppDispatch, useAppSelector} from "@hooks/useRedux"
import {setSidebarLeft} from "@store/reducers/appReducer";
import {IAdaptMessenger} from "@appTypes";
import {getDate} from "@utils/logic/getDate";
import {clsx} from "clsx";
import SearchMessage from "../searchMessage/SearchMessage";
import MessengerSettingsService from "@service/MessengerSettingsService";
import {useNavigate, useParams} from "react-router-dom";
import {addContact, deleteContact} from "@store/reducers/liveUpdatesReducer";
import {deleteMessenger} from "@store/thunks/liveUpdatesThunks";
import UserService from "@service/UserService";
import MessengerManagementService from "@service/MessengerManagementService";
import {useAbortController} from "@hooks/useAbortController";

interface IChatHeader {
    messenger: IAdaptMessenger,
    setSidebarState: Dispatch<SetStateAction<boolean>>
}

const MessengerHeader: FC<IChatHeader> = memo(({messenger, setSidebarState}) => {
    const [settings, setSettings] = useState(false)
    const [inputState, setInputState] = useState(false)

    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const userId = useAppSelector(state => state.user.userId)
    const {contacts} = useAppSelector(state => state.live)

    const {messengerId} = useParams()
    const {getSignal} = useAbortController()

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

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

    const HeaderLists = {
        chat: [
            {
                liChildren: <HiOutlineBellSlash/>,
                liText: 'Mute',
                liFoo: () => {
                }
            },
            contacts.some(el => el.user_id === messengerId) ?
                {
                    liChildren: <HiOutlineUserMinus/>,
                    liText: 'Remove from contacts',
                    liFoo: async () => {
                        if (!messengerId) return
                        const signal = getSignal()

                        try {
                            const res = await UserService.deleteContact(userId, messengerId, signal)

                            if (res.status === 200) dispatch(deleteContact(messengerId))
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } :
                {
                    liChildren: <HiOutlineUserPlus/>,
                    liText: 'Add to contacts',
                    liFoo: async () => {
                        if (!messengerId) return
                        const signal = getSignal()

                        try {
                            const newContact = await UserService.postContact(userId, messengerId, signal)

                            if (newContact.status === 200) dispatch(addContact(newContact.data))
                        } catch (error) {
                            console.log(error)
                        }
                    }
                },
            {
                liChildren: <HiOutlineTrash/>,
                liText: 'Delete Chat',
                liFoo: async () => {
                    if (!messengerId) return
                    const signal = getSignal()

                    try {
                        const res = await MessengerManagementService.deleteChat(userId, messengerId, signal)

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId))
                            navigate('/')
                        }
                    } catch (error) {
                        console.log(error)
                    }
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
                liFoo: async () => {
                    if (!messengerId) return
                    const signal = getSignal()

                    try {
                        const res = await MessengerSettingsService.deleteMember(userId, messengerId, signal)

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId))
                            navigate('/')
                        }
                    } catch (error) {
                        console.log(error)
                    }
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
                liFoo: async () => {
                    if (!messengerId) return
                    const signal = getSignal()

                    try {
                        const res = await MessengerSettingsService.deleteMember(userId, messengerId, signal)

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId))
                            navigate('/')
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        ]
    }

    return (
        <header className={clsx(style.ChatHeader, style.MainHeader)}>
            <Buttons.DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                <HiOutlineArrowLeft/>
            </Buttons.DefaultButton>
            <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                <LoadFile
                    imagePath={
                        messenger.image ?
                            `${messenger.type !== "chat" ? "messengers" : "users"}/${messenger.id}/${messenger.image}` :
                            ''
                    }
                    imageTitle={messenger.name}
                    key={messenger.id}
                />
                <div>
                    <h3>{messenger.name}</h3>
                    <p>{getHeaderDesc()}</p>
                </div>
            </button>
            <SearchMessage
                messenger={messenger}
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