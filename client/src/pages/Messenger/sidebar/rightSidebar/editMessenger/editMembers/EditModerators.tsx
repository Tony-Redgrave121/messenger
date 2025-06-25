import React, {Dispatch, FC, RefObject, SetStateAction} from 'react'
import {SidebarContainer, TopBar} from "../../../index"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IContact, IMessengerSettings, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft,
    HiOutlineShieldExclamation,
    HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import NoResult from "@components/noResult/NoResult";
import MembersList from "./membersList/MembersList";
import closeForm from "@utils/logic/closeForm";
import PopupEditModerators from "@components/popup/popupEditMembers/PopupEditModerators";
import useEditModerators from "@utils/hooks/settings/useEditModerators";
import useEditSettings from "@utils/hooks/settings/useEditSettings";

interface IEditMemberProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    moderators: IContact[],
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const EditModerators: FC<IEditMemberProps> = (
    {
        setState,
        refSidebar,
        state,
        members,
        moderators,
        setSettings
    }
) => {
    const {
        animation,
        newMembers,
        setNewMembers,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    } = useEditModerators(moderators, state, setState)

    const {
        deleteFromGroup,
        dismissModerator,
        handleCancel,
        setPopup,
        popup
    } = useEditSettings(setSettings)

    const ModeratorDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Remove from group',
            liFoo: () => deleteFromGroup(user_id)
        },
        {
            liChildren: <HiOutlineShieldExclamation/>,
            liText: 'Dismiss Moderator',
            liFoo: () => dismissModerator(user_id)
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
                        <Buttons.DefaultButton foo={() => closeForm('moderators', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Moderators</p>
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
                                dropList={ModeratorDropDown}
                            /> : <NoResult filter={filter}/>
                        }
                    </div>
                    <Caption/>
                    <PopupContainer state={popup} handleCancel={handleCancel}>
                        <PopupEditModerators
                            handleCancel={handleCancel}
                            members={members}
                            moderators={newMembers}
                            setMembers={setNewMembers}
                            setSettings={setSettings}
                        />
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditModerators