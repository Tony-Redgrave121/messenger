import { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlineUserPlus } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useEditRemoved from '@features/EditMessenger/lib/hooks/useEditRemoved';
import useEditSettings from '@features/EditMessenger/lib/hooks/useEditSettings';
import PopupEditRemoved from '@features/EditMessenger/ui/PopupEditMembers/PopupEditRemoved';
import { MembersList } from '@entities/Member';
import { MessengerSettingsKeys, MessengerSettingsSchema } from '@entities/Messenger';
import { closeForm } from '@shared/lib';
import { ToggleState, ContactSchema } from '@shared/types';
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
    removed: ContactSchema[];
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const EditMembers: FC<IEditMemberProps> = ({ setState, state, members, removed, setSettings }) => {
    const { refForm, searchRef, filteredArr, handleInput, filter } = useEditRemoved(removed);
    const refEditRemoved = useRef<HTMLDivElement>(null);

    const { handleCancel, addToGroup, deleteFromRemoved, setPopup, popup } =
        useEditSettings(setSettings);

    const RemovedDropDown = useCallback(
        (userId: string) => [
            {
                liChildren: <HiOutlineUserPlus />,
                liText: 'Add to Messenger',
                liFoo: () => addToGroup(userId),
            },
            {
                liChildren: <HiOutlineTrash />,
                liText: 'Unblock user',
                liFoo: () => deleteFromRemoved(userId),
            },
        ],
        [addToGroup, deleteFromRemoved],
    );

    return (
        <CSSTransition
            in={state}
            nodeRef={refEditRemoved}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditRemoved}
            >
                <TopBar>
                    <span>
                        <DefaultButton
                            foo={() => closeForm('removedUsers', setState)}
                            ariaLabel="Close"
                        >
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Removed Users</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SearchBar foo={handleInput} searchRef={searchRef} />
                        <CreateButton
                            state={true}
                            foo={() => setPopup(true)}
                            ariaLabel="Open Popup"
                        >
                            <HiOutlineUserPlus />
                        </CreateButton>
                    </div>
                    <Caption />
                    <div>
                        {filteredArr.length > 0 ? (
                            <MembersList members={filteredArr} dropList={RemovedDropDown} />
                        ) : (
                            <NoResult filter={filter} />
                        )}
                    </div>
                    <Caption />
                    <Popup state={popup} handleCancel={handleCancel}>
                        <PopupEditRemoved
                            handleCancel={handleCancel}
                            members={members}
                            setSettings={setSettings}
                        />
                    </Popup>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditMembers;
