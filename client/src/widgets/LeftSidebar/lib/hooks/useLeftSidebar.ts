import React, {useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@shared/lib";
import {useLiveUpdatesWS} from "@entities/Reaction/lib/hooks/useLiveUpdatesWS";
import debounce from "debounce";
import {useNavigate} from "react-router";
import {IUnifiedMessenger} from "@appTypes";
import {useAbortController} from "@shared/lib";
import useCloseLeftSidebar from "./useCloseLeftSidebar";
import {ListKeys} from "@shared/types";
import {setSidebarLeft} from "../../model/slice/sidebarSlice";
import getFilteredMessengersApi from "@widgets/LeftSidebar/api/getFilteredMessengersApi";
import isChatArray from "../isChatArray";
import isMessengerArray from "../isMessengerArray";

const useLeftSidebar = () => {
    const [settings, setSettings] = useState(false)
    const [messenger, setMessenger] = useState(false)
    const [search, setSearch] = useState(false)
    const [filter, setFilter] = useState('')
    const [profile, setProfile] = useState(false)
    const [messengerCreation, setMessengerCreation] = useState({
        state: false,
        type: ''
    })
    const refSearch = useRef<HTMLDivElement>(null)
    const refSidebar = useRef<HTMLDivElement>(null)
    const refProfile = useRef<HTMLDivElement>(null)
    const sidebarLeft = useAppSelector(state => state.sidebar.sidebarLeft)
    const {userImg, userName, userId} = useAppSelector(state => state.user)
    const contacts = useAppSelector(state => state.contact.contacts)

    const socketRef = useLiveUpdatesWS()
    const navigate = useNavigate()
    const {getSignal} = useAbortController()
    const {closeSidebar} = useCloseLeftSidebar()

    const [searchRes, setSearchRes] = useState<IUnifiedMessenger[]>([])
    const [active, setActive] = useState<ListKeys>('chat')

    const navigateChat = (user_id: string) => {
        closeSidebar()
        return navigate(`/chat/${user_id}`)
    }

    const searchDebounce = useMemo(() =>
        debounce(async (query: string, type: string) => {
            if (!query) return

            try {
                const signal = getSignal()
                const searched = await getFilteredMessengersApi(query, type, signal)

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

export default useLeftSidebar