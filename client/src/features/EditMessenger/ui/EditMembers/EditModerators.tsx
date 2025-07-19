import React, { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react';
import {
    HiOutlineArrowLeft,
    HiOutlineShieldExclamation,
    HiOutlineTrash,
    HiOutlineUserPlus,
} from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useEditModerators from '@features/EditMessenger/lib/hooks/useEditModerators';
import useEditSettings from '@features/EditMessenger/lib/hooks/useEditSettings';
import PopupEditModerators from '@features/EditMessenger/ui/PopupEditMembers/PopupEditModerators';
import { MembersList } from '@entities/Member';
import { MessengerSettingsKeys, MessengerSettingsSchema } from '@entities/Messenger';
import { closeForm } from '@shared/lib';
import { ContactSchema, ToggleState } from '@shared/types';
import {
    CreateButton,
    DefaultButton,
    Caption,
    NoResult,
    Popup,
    SearchBar,
    Sidebar,
    TopBar,
} from '@shared/ui';
import style from './style.module.css';

interface IEditMemberProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>;
    members: ContactSchema[];
    moderators: ContactSchema[];
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const EditModerators: FC<IEditMemberProps> = ({
    setState,
    state,
    members,
    moderators,
    setSettings,
}) => {
    const refEditModerators = useRef<HTMLDivElement>(null);

    const { newMembers, setNewMembers, refForm, searchRef, filteredArr, handleInput, filter } =
        useEditModerators(moderators);
    const { deleteFromGroup, dismissModerator, handleCancel, setPopup, popup } =
        useEditSettings(setSettings);

    const ModeratorDropDown = useCallback(
        (userId: string) => [
            {
                liChildren: <HiOutlineTrash />,
                liText: 'Remove from group',
                liFoo: () => deleteFromGroup(userId),
            },
            {
                liChildren: <HiOutlineShieldExclamation />,
                liText: 'Dismiss Moderator',
                liFoo: () => dismissModerator(userId),
            },
        ],
        [deleteFromGroup, dismissModerator],
    );

    return (
        <CSSTransition
            in={state}
            nodeRef={refEditModerators}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditModerators}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('moderators', setState)}>
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Moderators</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SearchBar foo={handleInput} searchRef={searchRef} />
                        <CreateButton state={true} foo={() => setPopup(true)}>
                            <HiOutlineUserPlus />
                        </CreateButton>
                    </div>
                    <Caption />
                    <div>
                        {filteredArr.length > 0 ? (
                            <MembersList members={filteredArr} dropList={ModeratorDropDown} />
                        ) : (
                            <NoResult filter={filter} />
                        )}
                    </div>
                    <Caption />
                    <Popup state={popup} handleCancel={handleCancel}>
                        <PopupEditModerators
                            handleCancel={handleCancel}
                            members={members}
                            moderators={newMembers}
                            setMembers={setNewMembers}
                            setSettings={setSettings}
                        />
                    </Popup>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditModerators;
