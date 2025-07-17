import { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineMinusCircle, HiOutlineUserPlus } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import MembersList from '@entities/Member/ui/MembersList/MembersList';
import MessengerSettingsKeys from '@entities/Messenger/model/types/MessengerSettingsKeys';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { closeForm } from '@shared/lib';
import { ContactSchema } from '@shared/types';
import { ToggleState } from '@shared/types';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { NoResult } from '@shared/ui/NoResult';
import { Popup } from '@shared/ui/Popup';
import { SearchBar } from '@shared/ui/SearchBar';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import useEditSettings from '../../lib/hooks/useEditSettings';
import useEditSubscribers from '../../lib/hooks/useEditSubscribers';
import PopupEditSubscribers from '../PopupEditMembers/PopupEditSubscribers';
import style from './style.module.css';

interface IEditSubscribersProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>;
    members: ContactSchema[];
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const EditSubscribers: FC<IEditSubscribersProps> = ({ setState, state, members, setSettings }) => {
    const { refForm, searchRef, filteredArr, handleInput, filter } = useEditSubscribers(members);
    const refEditSubscribers = useRef<HTMLDivElement>(null);

    const { deleteFromGroup, handleCancel, setPopup, popup } = useEditSettings(setSettings);

    const SubscribersDropDown = useCallback(
        (userId: string) => [
            {
                liChildren: <HiOutlineMinusCircle />,
                liText: 'Remove from group',
                liFoo: () => deleteFromGroup(userId),
            },
        ],
        [deleteFromGroup],
    );

    return (
        <CSSTransition
            in={state}
            nodeRef={refEditSubscribers}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditSubscribers}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('subscribers', setState)}>
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Add Subscribers</p>
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
                            <MembersList members={filteredArr} dropList={SubscribersDropDown} />
                        ) : (
                            <NoResult filter={filter} />
                        )}
                    </div>
                    <Caption />
                    <Popup state={popup} handleCancel={handleCancel}>
                        <PopupEditSubscribers
                            handleCancel={handleCancel}
                            setSettings={setSettings}
                        />
                    </Popup>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditSubscribers;
