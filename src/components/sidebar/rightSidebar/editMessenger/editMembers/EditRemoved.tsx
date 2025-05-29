import {Dispatch, FC, RefObject, SetStateAction} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IContact, IMessengerSettings, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft,
    HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import PopupEditRemoved from "@components/popup/popupEditMembers/PopupEditRemoved";
import NoResult from "@components/noResult/NoResult";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";
import closeForm from "@utils/logic/closeForm";
import useEditSettings from "@utils/hooks/settings/useEditSettings";
import useEditRemoved from "@utils/hooks/settings/useEditRemoved";

interface IEditMemberProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    removed: IContact[],
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const EditMembers: FC<IEditMemberProps> = (
    {
        setState,
        refSidebar,
        state,
        members,
        removed,
        setSettings
    }
) => {
    const {
        animation,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    } = useEditRemoved(state, setState, removed)

    const {
        handleCancel,
        addToGroup,
        deleteFromRemoved,
        setPopup,
        popup
    } = useEditSettings(setSettings)

    const RemovedDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineUserPlus/>,
            liText: 'Add to SearchList',
            liFoo: () => addToGroup(user_id)
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Unblock user',
            liFoo: () => deleteFromRemoved(user_id)
        }
    ]

    return (
        <CSSTransition
            in={animation}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <Buttons.DefaultButton foo={() => closeForm('removedUsers', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Removed Users</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SearchBlock foo={handleInput} ref={searchRef}/>
                        <Buttons.CreateButton state={true} foo={() => setPopup(true)}>
                            <HiOutlineUserPlus/>
                        </Buttons.CreateButton>
                    </div>
                    <Caption/>
                    <div>
                        {filteredArr.length > 0 ?
                            <MembersList
                                members={filteredArr}
                                dropList={RemovedDropDown}
                            /> : <NoResult filter={filter}/>
                        }
                    </div>
                    <Caption/>
                    <PopupContainer state={popup} handleCancel={handleCancel}>
                        <PopupEditRemoved
                            handleCancel={handleCancel}
                            members={members}
                            setSettings={setSettings}
                        />
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMembers