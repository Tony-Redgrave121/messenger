import {
    HiBars3, HiOutlineBugAnt, HiOutlineCog8Tooth,
    HiOutlinePencil, HiOutlineQuestionMarkCircle, HiOutlineUsers
} from "react-icons/hi2"
import style from './style.module.css'
import {Buttons} from '@components/buttons'
import {SearchBlock} from "@components/searchBlock"
import {DropDown} from "@components/dropDown"
import {SidebarContainer} from "../index";
import {CSSTransition} from "react-transition-group"
import './animation.css'
import useLeftSidebarLogic from "@utils/hooks/useLeftSidebarLogic"
import Caption from "@components/caption/Caption";
import React, {lazy} from "react";
import {ChatList} from "@components/chatList";
import {LoadFile} from "@components/loadFile";
import {ContactList} from "@components/contacts";

const SearchList = lazy(() => import("./searchList/SearchList"))
const Profile = lazy(() => import("./profile/Profile"))
const Messenger = lazy(() => import("./messenger/Messenger"))

const LeftSidebar = () => {
    const {
        sidebarLeft, refSidebar,
        setSettings, settings,
        refSearch, userImg,
        userName, userId,
        setMessenger, contacts,
        messenger, messengersList,
        messengerCreation, socketRef,
        setMessengerCreation, profile,
        setProfile, refProfile,
        navigateChat, searchRes,
        active, setActive,
        handleInput, search
    } = useLeftSidebarLogic()

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

    return (
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
                        <DropDown list={dropDownList} state={settings} setState={setSettings}/>
                    </Buttons.DefaultButton>
                    <SearchBlock ref={refSearch} foo={handleInput}/>
                </div>
                <ChatList/>
                {contacts.length &&
                    <>
                        <Caption/>
                        <ContactList
                            contacts={contacts}
                            text='Contacts'
                            onClick={navigateChat}
                        />
                    </>
                }
                <Buttons.CreateButton state={true} foo={() => setMessenger(!messenger)}>
                    <HiOutlinePencil/>
                    <DropDown list={messengersList} state={messenger} setState={setMessenger}/>
                </Buttons.CreateButton>
                {(messengerCreation.type && socketRef) &&
                    <Messenger
                        messengerCreation={messengerCreation}
                        setMessengerCreation={setMessengerCreation}
                        socketRef={socketRef}
                    />
                }
                {profile.mounted &&
                    <Profile
                        setState={setProfile}
                        state={profile}
                        refSidebar={refProfile}
                    />
                }
                <SearchList
                    animationState={search}
                    active={active}
                    setActive={setActive}
                    searchRes={searchRes}
                />
            </SidebarContainer>
        </CSSTransition>
    )
}

export default LeftSidebar