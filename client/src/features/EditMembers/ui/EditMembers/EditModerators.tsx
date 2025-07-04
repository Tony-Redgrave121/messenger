import React, {Dispatch, FC, RefObject, SetStateAction} from 'react'
import {CSSTransition} from "react-transition-group"
import style from "./style.module.css"
import {
    HiOutlineArrowLeft,
    HiOutlineShieldExclamation,
    HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import {Caption} from "@shared/ui/Caption";
import {SearchBar} from "@shared/ui/SearchBar";
import {Popup} from "@shared/ui/Popup";
import {NoResult} from "@shared/ui/NoResult";
import MembersList from "@entities/Member/ui/MembersList/MembersList";
import {closeForm} from "@shared/lib";
import PopupEditModerators from "../PopupEditMembers/PopupEditModerators";
import useEditModerators from "../../lib/hooks/useEditModerators";
import useEditSettings from "../../lib/hooks/useEditSettings";
import {CreateButton, DefaultButton} from "@shared/ui/Button";
import {TopBar} from "@shared/ui/TopBar";
import {Sidebar} from "@shared/ui/Sidebar";
import {ToggleState} from "@shared/types";
import {ContactSchema} from "@entities/Contact";
import MessengerSettingsSchema from "@features/EditMessenger/model/types/MessengerSettingsSchema";
import MessengerSettingsKeys from "@entities/Messenger/model/types/MessengerSettingsKeys";

interface IEditMemberProps {
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: ContactSchema[],
    moderators: ContactSchema[],
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>
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
        newMembers,
        setNewMembers,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    } = useEditModerators(moderators)

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
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('moderators', setState)}>
                            <HiOutlineArrowLeft/>
                        </DefaultButton>
                        <p>Moderators</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SearchBar foo={handleInput} searchRef={searchRef}/>
                        <CreateButton state={true} foo={() => setPopup(true)}>
                            <HiOutlineUserPlus/>
                        </CreateButton>
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
    )
}

export default EditModerators