import React, { lazy, memo, Suspense } from 'react';
import { HiBars3, HiOutlinePencil } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useGetContacts from '@widgets/LeftSidebar/lib/hooks/useGetContacts';
import useLeftSidebar from '@widgets/LeftSidebar/lib/hooks/useLeftSidebar';
import MessengersDropDown from '@widgets/LeftSidebar/ui/LeftSidebar/MessengersDropDown';
import UserDropDown from '@widgets/LeftSidebar/ui/LeftSidebar/UserDropDown';
import { ChatList } from '@features/СhatList';
import { ContactList } from '@entities/Contact';
import { useAppSelector } from '@shared/lib';
import { CreateButton, DefaultButton, Caption, SearchBar, Sidebar } from '@shared/ui';
import style from './left-sidebar.module.css';
import './left-sidebar.animation.css';

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
        setMessengerDropDown,
        messengerDropDown,
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
                        <UserDropDown
                            setMessengerCreation={setMessengerCreation}
                            state={settings}
                            setState={setSettings}
                            setProfile={setProfile}
                        />
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
                <CreateButton state={true} foo={() => setMessengerDropDown(prev => !prev)}>
                    <HiOutlinePencil />
                    <MessengersDropDown
                        setMessengerCreation={setMessengerCreation}
                        setState={setMessengerDropDown}
                        state={messengerDropDown}
                    />
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
