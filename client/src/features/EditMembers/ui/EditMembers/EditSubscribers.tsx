import { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { CSSTransition } from 'react-transition-group';
import style from './style.module.css';
import { HiOutlineArrowLeft, HiOutlineMinusCircle, HiOutlineUserPlus } from 'react-icons/hi2';
import { Caption } from '@shared/ui/Caption';
import { SearchBar } from '@shared/ui/SearchBar';
import { NoResult } from '@shared/ui/NoResult';
import MembersList from '@entities/Member/ui/MembersList/MembersList';
import PopupEditSubscribers from '../PopupEditMembers/PopupEditSubscribers';
import { closeForm } from '@shared/lib';
import useEditSettings from '../../lib/hooks/useEditSettings';
import useEditSubscribers from '../../lib/hooks/useEditSubscribers';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { Popup } from '@shared/ui/Popup';
import { TopBar } from '@shared/ui/TopBar';
import { Sidebar } from '@shared/ui/Sidebar';
import { ToggleState } from '@shared/types';
import { ContactSchema } from '@entities/Contact';
import MessengerSettingsSchema from '@features/EditMessenger/model/types/MessengerSettingsSchema';
import MessengerSettingsKeys from '@entities/Messenger/model/types/MessengerSettingsKeys';

interface IEditSubscribersProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>;
    refSidebar: RefObject<HTMLDivElement | null>;
    members: ContactSchema[];
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const EditSubscribers: FC<IEditSubscribersProps> = ({
    setState,
    refSidebar,
    state,
    members,
    setSettings,
}) => {
    const { refForm, searchRef, filteredArr, handleInput, filter } = useEditSubscribers(
        state,
        setState,
        members,
    );

    const { deleteFromGroup, handleCancel, setPopup, popup } = useEditSettings(setSettings);

    const SubscribersDropDown = (userId: string) => [
        {
            liChildren: <HiOutlineMinusCircle />,
            liText: 'Remove from group',
            liFoo: () => deleteFromGroup(userId),
        },
    ];

    return (
        <CSSTransition
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refSidebar}
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
