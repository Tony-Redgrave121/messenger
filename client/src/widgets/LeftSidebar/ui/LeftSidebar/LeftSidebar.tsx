import React, { lazy, memo, Suspense, useMemo } from 'react';
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
import './left-sidebar.animation.css';
import { CSSTransition } from 'react-transition-group';
import { ContactList } from '@features/ContactList';
import { ChatList } from '@features/СhatList';
import { useAppSelector } from '@shared/lib';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { DropDown } from '@shared/ui/DropDown';
import { LoadFile } from '@shared/ui/LoadFile';
import { SearchBar } from '@shared/ui/SearchBar';
import { Sidebar } from '@shared/ui/Sidebar';
import useGetContacts from '../../lib/hooks/useGetContacts';
import useLeftSidebar from '../../lib/hooks/useLeftSidebar';
import style from './style.module.css';

const MessengerSearch = lazy(() => import('@features/MessengerSearch/ui/MessengerSearch'));
const Profile = lazy(() => import('@features/Profile/ui/Profile/Profile'));
const CreateMessenger = lazy(() => import('@features/CreateMessenger/ui/CreateMessenger'));

const LeftSidebar = memo(() => {
    const contacts = useAppSelector(state => state.contact.contacts);

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
        messenger,
        search,
        messengerCreation,
        setMessengerCreation,
        profile,
        setProfile,
        navigateChat,
        searchRes,
        active,
        setActive,
        handleInput,
    } = useLeftSidebar();

    useGetContacts();

    const messengersList = useMemo(
        () => [
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
        ],
        [setMessengerCreation],
    );

    const dropDownList = useMemo(
        () => [
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
        ],
        [setMessengerCreation, setProfile, userId, userImg, userName],
    );

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
                {messengerCreation.type && (
                    <Suspense>
                        <CreateMessenger
                            messengerCreation={messengerCreation}
                            setMessengerCreation={setMessengerCreation}
                        />
                    </Suspense>
                )}
                <Profile setState={setProfile} state={profile} />
                <MessengerSearch
                    animationState={search}
                    active={active}
                    setActive={setActive}
                    searchRes={searchRes}
                />
            </Sidebar>
        </CSSTransition>
    );
});

LeftSidebar.displayName = 'LeftSidebar';

export default LeftSidebar;
