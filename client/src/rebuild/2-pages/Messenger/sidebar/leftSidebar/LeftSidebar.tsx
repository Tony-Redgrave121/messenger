import {
    HiBars3, HiOutlineBugAnt, HiOutlineCog8Tooth,
    HiOutlinePencil, HiOutlineQuestionMarkCircle, HiOutlineUsers
} from "react-icons/hi2"
import style from './style.module.css'
import {SearchBar} from "../../../../shared/ui/SearchBar"
import {DropDown} from "../../../../shared/ui/DropDown"
import {CSSTransition} from "react-transition-group"
import './animation.css'
import useLeftSidebarLogic from "@utils/hooks/useLeftSidebarLogic"
import {Caption} from "../../../../shared/ui/Caption";
import React, {lazy} from "react";
import {ChatList} from "../../../../4-features/СhatList";
import {LoadFile} from "@components/loadFile";
import {ContactList} from "@components/contacts";
import {CreateButton, DefaultButton} from "../../../../shared/ui/Button";
import {Sidebar} from "../../../../shared/ui/Sidebar";

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
            liFoo: () => setProfile(true)
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
            liFoo: () =>  setProfile(true)
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
            <Sidebar styles={['LeftSidebarContainer']} ref={refSidebar}>
                <div className={style.TopBar}>
                    <DefaultButton foo={() => setSettings(!settings)}>
                        <HiBars3/>
                        <DropDown list={dropDownList} state={settings} setState={setSettings}/>
                    </DefaultButton>
                    <SearchBar searchRef={refSearch} foo={handleInput}/>
                </div>
                <ChatList/>
                {contacts.length > 0 &&
                    <>
                        <Caption/>
                        <ContactList
                            contacts={contacts}
                            text='Contacts'
                            onClick={navigateChat}
                        />
                    </>
                }
                <CreateButton state={true} foo={() => setMessenger(!messenger)}>
                    <HiOutlinePencil/>
                    <DropDown list={messengersList} state={messenger} setState={setMessenger}/>
                </CreateButton>
                {(messengerCreation.type && socketRef) &&
                    <Messenger
                        messengerCreation={messengerCreation}
                        setMessengerCreation={setMessengerCreation}
                        socketRef={socketRef}
                    />
                }
                <Profile
                    setState={setProfile}
                    state={profile}
                    refSidebar={refProfile}
                />
                <SearchList
                    animationState={search}
                    active={active}
                    setActive={setActive}
                    searchRes={searchRes}
                />
            </Sidebar>
        </CSSTransition>
    )
}

export default LeftSidebar