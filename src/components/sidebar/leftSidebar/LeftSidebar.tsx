import React, {useEffect, useRef, useState} from 'react'
import {
    HiBars3,
    HiOutlineCog8Tooth,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineBugAnt,
    HiOutlinePencil,
    HiOutlineMegaphone,
    HiOutlineUser
} from "react-icons/hi2"
import style from './style.module.css'
import Buttons from '../../buttons/Buttons'
import SearchBlock from "../../searchBlock/SearchBlock"
import ChatList from "../../chatList/ChatList"
import DropDown from "../../dropDown/DropDown"
import SidebarContainer from "../SidebarContainer";
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/useRedux";
import {CSSTransition} from "react-transition-group"
import {setSidebarLeft} from "../../../store/reducers/appReducer"
import debounce from "debounce";
import './animation.css'
import Messenger from "./messenger/Messenger";
import {useMessengerWS} from "../../../utils/hooks/useMessengerWS";
import ContactList from "../../contactList/ContactList";
import useGetContacts from "../../../utils/hooks/useGetContacts";
import LoadFile from "../../loadFile/LoadFile";
import Profile from "./profile/Profile";

const LeftSidebar = () => {
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

    const handleResize = debounce(() => {
        if (window.innerWidth >= 940) dispatch(setSidebarLeft(true))
        else dispatch(setSidebarLeft(false))
    }, 100)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [dispatch, handleResize])

    const listMessenger = [
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

    const list = [
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

    return (
        <>
            <CSSTransition
                in={sidebarLeft}
                nodeRef={refSidebar}
                timeout={300}
                classNames='left-sidebar-node'
                unmountOnExit
            >
                <SidebarContainer styles={['LeftSidebarContainer']} ref={refSidebar}>
                    <div className={style.TopBar}>
                        <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                            <HiBars3/>
                            <DropDown list={list} state={settings} setState={setSettings}/>
                        </Buttons.DefaultButton>
                        <SearchBlock ref={refSearch} foo={() => {}}/>
                    </div>
                    <ChatList/>
                    <hr/>
                    <ContactList contacts={contacts}/>
                    <span className={style.CreateButton}>
                        <Buttons.InterButton foo={() => setMessenger(!messenger)}>
                            <HiOutlinePencil/>
                            <DropDown list={listMessenger} state={messenger} setState={setMessenger}/>
                        </Buttons.InterButton>
                    </span>
                    {(messengerCreation.type && socketRef) && <Messenger messengerCreation={messengerCreation} setMessengerCreation={setMessengerCreation} socketRef={socketRef}/>}
                    {profile.mounted && <Profile setState={setProfile} state={profile} refSidebar={refProfile}/>}
                </SidebarContainer>
            </CSSTransition>
        </>
    )
}

export default LeftSidebar