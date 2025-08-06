import React, { lazy, memo, Suspense } from 'react';
import { HiBars3, HiOutlinePencil } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useLeftSidebar from '@widgets/LeftSidebar/lib/hooks/useLeftSidebar';
import MessengersDropDown from '@widgets/LeftSidebar/ui/LeftSidebar/MessengersDropDown';
import UserDropDown from '@widgets/LeftSidebar/ui/LeftSidebar/UserDropDown';
import { ChatList } from '@features/ChatList';
import { UserContacts } from '@features/UserContacts';
import { CreateButton, DefaultButton, Caption, SearchBar, Sidebar } from '@shared/ui';
import style from './left-sidebar.module.css';
import './left-sidebar.animation.css';

const MessengerSearch = lazy(() => import('@features/MessengerSearch/ui/MessengerSearch'));
const Profile = lazy(() => import('@features/Profile/ui/Profile/Profile'));
const CreateMessenger = lazy(() => import('@features/CreateMessenger/ui/CreateMessenger'));

const LeftSidebar = memo(() => {
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
        searchRes,
        active,
        setActive,
        handleInput,
    } = useLeftSidebar();

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
                    <div className={style.DropDownButton}>
                        <DefaultButton foo={() => setSettings(!settings)} ariaLabel="Find messages">
                            <HiBars3 />
                        </DefaultButton>
                        <UserDropDown
                            setMessengerCreation={setMessengerCreation}
                            state={settings}
                            setState={setSettings}
                            setProfile={setProfile}
                        />
                    </div>
                    <SearchBar searchRef={refSearch} foo={handleInput} />
                </div>
                <ChatList />
                <Caption />
                <UserContacts />
                <div className={style.DropDownCreateButton}>
                    <CreateButton
                        state={true}
                        foo={() => setMessengerDropDown(prev => !prev)}
                        ariaLabel="Open the sidebar to create a new messenger"
                    >
                        <HiOutlinePencil />
                    </CreateButton>
                    <MessengersDropDown
                        setMessengerCreation={setMessengerCreation}
                        setState={setMessengerDropDown}
                        state={messengerDropDown}
                    />
                </div>
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
