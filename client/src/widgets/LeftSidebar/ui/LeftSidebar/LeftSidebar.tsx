import {
    HiBars3,
    HiOutlineBugAnt,
    HiOutlineCog8Tooth,
    HiOutlineMegaphone,
    HiOutlinePencil,
    HiOutlineQuestionMarkCircle,
    HiOutlineUser,
    HiOutlineUsers,
} from 'react-icons/hi2';
import style from './style.module.css';
import { SearchBar } from '@shared/ui/SearchBar';
import { DropDown } from '@shared/ui/DropDown';
import { CSSTransition } from 'react-transition-group';
import './left-sidebar.animation.css';
import useLeftSidebar from '../../lib/hooks/useLeftSidebar';
import { Caption } from '@shared/ui/Caption';
import React, { lazy } from 'react';
import { ChatList } from '@features/СhatList';
import { LoadFile } from '@shared/ui/LoadFile';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { Sidebar } from '@shared/ui/Sidebar';
import { ContactList } from '@features/ContactList';
import useGetContacts from '../../lib/hooks/useGetContacts';

const SearchList = lazy(() => import('@features/MessengerSearch/ui/MessengerSearch'));
const Profile = lazy(() => import('@features/Profile/ui/Profile/Profile'));
const Messenger = lazy(() => import('@features/CreateMessenger/ui/CreateMessenger'));

const LeftSidebar = () => {
    const {
        sidebarLeft,
        refSidebar,
        setSettings,
        settings,
        refSearch,
        userImg,
        userName,
        userId,
        setMessenger,
        contacts,
        messenger,
        search,
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
    } = useLeftSidebar();
    useGetContacts();

    const messengersList = [
        {
            liChildren: <HiOutlineMegaphone />,
            liText: 'New Channel',
            liFoo: () =>
                setMessengerCreation(prev => ({
                    state: !prev.state,
                    type: 'channel',
                })),
        },
        {
            liChildren: <HiOutlineUsers />,
            liText: 'New Group',
            liFoo: () =>
                setMessengerCreation(prev => ({
                    state: !prev.state,
                    type: 'group',
                })),
        },
        {
            liChildren: <HiOutlineUser />,
            liText: 'New Private Chat',
            liFoo: () =>
                setMessengerCreation(prev => ({
                    state: !prev.state,
                    type: 'chat',
                })),
        },
    ];

    const dropDownList = [
        {
            liChildren: (
                <LoadFile
                    imagePath={userImg ? `users/${userId}/${userImg}` : ''}
                    imageTitle={userName}
                />
            ),
            liText: userName,
            liFoo: () => setProfile(true),
        },
        {
            liChildren: <HiOutlineUsers />,
            liText: 'Contacts',
            liFoo: () =>
                setMessengerCreation(prev => ({
                    state: !prev.state,
                    type: 'chat',
                })),
        },
        {
            liChildren: <HiOutlineCog8Tooth />,
            liText: 'Settings',
            liFoo: () => setProfile(true),
        },
        {
            liChildren: <HiOutlineQuestionMarkCircle />,
            liText: 'CrowCaw Features',
            liFoo: () => {},
        },
        {
            liChildren: <HiOutlineBugAnt />,
            liText: 'Report Bug',
            liFoo: () => {},
        },
    ];

    return (
        <CSSTransition
            in={sidebarLeft}
            nodeRef={refSidebar}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar styles={['LeftSidebarContainer']} ref={refSidebar}>
                <div className={style.TopBar}>
                    <DefaultButton foo={() => setSettings(!settings)}>
                        <HiBars3 />
                        <DropDown list={dropDownList} state={settings} setState={setSettings} />
                    </DefaultButton>
                    <SearchBar searchRef={refSearch} foo={handleInput} />
                </div>
                <ChatList />
                {contacts.length > 0 && (
                    <>
                        <Caption />
                        <ContactList contacts={contacts} text="Contacts" onClick={navigateChat} />
                    </>
                )}
                <CreateButton state={true} foo={() => setMessenger(!messenger)}>
                    <HiOutlinePencil />
                    <DropDown list={messengersList} state={messenger} setState={setMessenger} />
                </CreateButton>
                {messengerCreation.type && socketRef && (
                    <Messenger
                        messengerCreation={messengerCreation}
                        setMessengerCreation={setMessengerCreation}
                        socketRef={socketRef}
                    />
                )}
                <Profile setState={setProfile} state={profile} refSidebar={refProfile} />
                <SearchList
                    animationState={search}
                    active={active}
                    setActive={setActive}
                    searchRes={searchRes}
                    foo={() => {}}
                />
            </Sidebar>
        </CSSTransition>
    );
};

export default LeftSidebar;
