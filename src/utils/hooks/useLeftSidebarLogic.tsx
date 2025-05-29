import React, {useEffect, useRef, useState} from "react";
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

const useLeftSidebarLogic = () => {
    const [settings, setSettings] = useState(false)
    const [messenger, setMessenger] = useState(false)
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
        navigateChat
    }
}

export default useLeftSidebarLogic