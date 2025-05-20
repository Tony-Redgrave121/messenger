import React from 'react'
import {
    HiBars3,
    HiOutlinePencil
} from "react-icons/hi2"
import style from './style.module.css'
import {Buttons} from '@components/buttons'
import {SearchBlock} from "@components/searchBlock"
import {ChatList} from "@components/chatList"
import {DropDown} from "@components/dropDown"
import {SidebarContainer} from "../";
import {CSSTransition} from "react-transition-group"
import './animation.css'
import Messenger from "./messenger/Messenger";
import {ContactList} from "@components/contacts";
import Profile from "./profile/Profile";
import useLeftSidebarLogic from "@utils/hooks/useLeftSidebarLogic"
import Caption from "@components/caption/Caption";

const LeftSidebar = () => {
    const {
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
    } = useLeftSidebarLogic()

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
                            <DropDown list={dropDownList} state={settings} setState={setSettings}/>
                        </Buttons.DefaultButton>
                        <SearchBlock ref={refSearch} foo={() => {
                        }}/>
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
                </SidebarContainer>
            </CSSTransition>
        </>
    )
}

export default LeftSidebar