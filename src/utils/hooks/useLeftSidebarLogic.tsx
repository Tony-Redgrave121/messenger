import React, {useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {useMessengerWS} from "@utils/hooks/useMessengerWS";
import useGetContacts from "@hooks/useGetContacts";
import debounce from "debounce";
import {setSidebarLeft} from "@store/reducers/appReducer";
import {
    HiOutlineBugAnt,
    HiOutlineCog8Tooth,
    HiOutlineMegaphone,
    HiOutlineQuestionMarkCircle,
    HiOutlineUser,
    HiOutlineUsers
} from "react-icons/hi2";
import {LoadFile} from "@components/loadFile";
import {useNavigate} from "react-router";
import SearchService from "@service/SearchService";
import {isChatArray, isMessengerArray, IUnifiedMessenger, ListKeys} from "@appTypes";

const useLeftSidebarLogic = () => {
    const [settings, setSettings] = useState(false)
    const [messenger, setMessenger] = useState(false)
    const [search, setSearch] = useState(false)
    const [filter, setFilter] = useState('')
    const [profile, setProfile] = useState({
        state: false,
        mounted: false
    })
    const [messengerCreation, setMessengerCreation] = useState({
        state: false,
        type: ''
    })
    const refSearch = useRef<HTMLDivElement>(null)
    const refSidebar = useRef<HTMLDivElement>(null)
    const refProfile = useRef<HTMLDivElement>(null)
    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const {userImg, userName, userId} = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const socketRef = useMessengerWS()
    const {contacts} = useGetContacts()
    const navigate = useNavigate()

    const [searchRes, setSearchRes] = useState<IUnifiedMessenger[]>([])
    const [active, setActive] = useState<ListKeys>('chat')

    const handleResize = debounce(() => {
        if (window.innerWidth >= 940) dispatch(setSidebarLeft(true))
        else dispatch(setSidebarLeft(false))
    }, 100)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [dispatch, handleResize])

    const messengersList = [
        {
            liChildren: <HiOutlineMegaphone/>,
            liText: 'New Channel',
            liFoo: () => setMessengerCreation(prev => ({
                state: !prev.state,
                type: 'channel'
            }))
        },
        {
            liChildren: <HiOutlineUsers/>,
            liText: 'New Group',
            liFoo: () => setMessengerCreation(prev => ({
                state: !prev.state,
                type: 'group'
            }))
        },
        {
            liChildren: <HiOutlineUser/>,
            liText: 'New Private SearchList',
            liFoo: () => setMessengerCreation(prev => ({
                state: !prev.state,
                type: 'chat'
            }))
        }
    ]

    const dropDownList = [
        {
            liChildren: <LoadFile imagePath={userImg ? `users/${userId}/${userImg}` : ''} imageTitle={userName}/>,
            liText: userName,
            liFoo: () => setProfile({
                state: true,
                mounted: true
            })
        },
        {
            liChildren: <HiOutlineUsers/>,
            liText: 'Contacts',
            liFoo: () => setMessengerCreation(prev => ({
                state: !prev.state,
                type: 'chat'
            }))
        },
        {
            liChildren: <HiOutlineCog8Tooth/>,
            liText: 'Settings',
            liFoo: () =>  setProfile({
                state: true,
                mounted: true
            })
        },
        {
            liChildren: <HiOutlineQuestionMarkCircle/>,
            liText: 'CrowCaw Features',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineBugAnt/>,
            liText: 'Report Bug',
            liFoo: () => {
            }
        }
    ]

    const navigateChat = (user_id: string) => {
        return navigate(`/chat/${user_id}`)
    }

    const searchDebounce = useMemo(() =>
        debounce(async (query: string, type: string) => {
            try {
                if (!query) return

                const controller = new AbortController()
                const signal = controller.signal

                const res = await SearchService.getMessengers(query, type, signal)

                if (res.status === 200) {
                    const messengersData = res.data
                    let unifiedMessengers: IUnifiedMessenger[] = []

                    if (isChatArray(messengersData)) {
                        unifiedMessengers = messengersData.map(item => ({
                            id: item.user_id,
                            name: item.user_name,
                            img: item.user_img,
                            desc: item.user_last_seen
                        }))
                    } else if (isMessengerArray(messengersData)) {
                        unifiedMessengers = messengersData.map(item => ({
                            id: item.messenger_id,
                            name: item.messenger_name,
                            img: item.messenger_image,
                            desc: item.count
                        }))
                    }

                    setSearchRes(unifiedMessengers)
                }
            } catch (e) {
                console.error(e)
            }
        }, 200), []
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase()
        setFilter(query)

        searchDebounce(query, active)
    }

    useEffect(() => {
        setSearchRes([])
        searchDebounce(filter, active)
    }, [active])

    useEffect(() => {
        if (filter) setSearch(true)
        else setSearch(false)
    }, [filter])

    return {
        sidebarLeft,
        refSidebar,
        setSettings,
        settings,
        dropDownList,
        refSearch,
        contacts,
        setMessenger,
        messenger,
        messengersList,
        messengerCreation,
        socketRef,
        setMessengerCreation,
        profile,
        setProfile,
        refProfile,
        navigateChat,
        searchRes,
        active,
        setActive,
        handleInput,
        search
    }
}

export default useLeftSidebarLogic