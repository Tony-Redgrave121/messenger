import React, {useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {useLiveUpdatesWS} from "@hooks/useLiveUpdatesWS";
import debounce from "debounce";
import {
    HiOutlineMegaphone,
    HiOutlineUser,
    HiOutlineUsers
} from "react-icons/hi2";
import {useNavigate} from "react-router";
import SearchService from "@service/SearchService";
import {isChatArray, isMessengerArray, IUnifiedMessenger, ListKeys} from "@appTypes";
import useGetContacts from "@hooks/useGetContacts";
import {useAbortController} from "@hooks/useAbortController";
import {setSidebarLeft} from "@store/reducers/appReducer";
import useCloseLeftSidebar from "@hooks/useCloseLeftSidebar";

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
    const contacts = useAppSelector(state => state.live.contacts)

    const socketRef = useLiveUpdatesWS()
    const navigate = useNavigate()
    const {getSignal} = useAbortController()
    const {closeSidebar} = useCloseLeftSidebar()

    const [searchRes, setSearchRes] = useState<IUnifiedMessenger[]>([])
    const [active, setActive] = useState<ListKeys>('chat')

    useGetContacts()

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
            liText: 'New Private Chat',
            liFoo: () => setMessengerCreation(prev => ({
                state: !prev.state,
                type: 'chat'
            }))
        }
    ]

    const navigateChat = (user_id: string) => {
        closeSidebar()
        return navigate(`/chat/${user_id}`)
    }

    const searchDebounce = useMemo(() =>
        debounce(async (query: string, type: string) => {
            if (!query) return

            try {
                const signal = getSignal()
                const searched = await SearchService.getMessengers(query, type, signal)

                if (searched.status === 200) {
                    const searchedData = searched.data

                    let unifiedMessengers: IUnifiedMessenger[] = []

                    if (isChatArray(searchedData)) {
                        unifiedMessengers = searchedData.map(item => ({
                            id: item.user_id,
                            name: item.user_name,
                            img: item.user_img,
                            desc: item.user_last_seen
                        }))
                    } else if (isMessengerArray(searchedData)) {
                        unifiedMessengers = searchedData.map(item => ({
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

    const dispatch = useAppDispatch()
    const handleResize = debounce(() => {
        if (window.innerWidth >= 940) dispatch(setSidebarLeft(true))
    }, 100)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [dispatch, handleResize])

    return {
        sidebarLeft,
        refSidebar,
        setSettings,
        settings,
        userImg,
        userName,
        userId,
        refSearch,
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
        search,
        contacts
    }
}

export default useLeftSidebarLogic