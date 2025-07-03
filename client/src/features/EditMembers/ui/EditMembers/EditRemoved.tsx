import {Dispatch, FC, RefObject, SetStateAction} from 'react'
import {CSSTransition} from "react-transition-group"
import {IMessengerSettings, SettingsKeys} from "@appTypes"
import style from "./style.module.css"
import {
    HiOutlineArrowLeft,
    HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import {Caption} from "@shared/ui/Caption";
import {SearchBar} from "@shared/ui/SearchBar";
import PopupEditRemoved from "../PopupEditMembers/PopupEditRemoved";
import {NoResult} from "@shared/ui/NoResult";
import MembersList from "@entities/Member/ui/MembersList/MembersList";
import {closeForm} from "@shared/lib";
import useEditSettings from "../../lib/hooks/useEditSettings";
import useEditRemoved from "../../lib/hooks/useEditRemoved";
import {CreateButton, DefaultButton} from "@shared/ui/Button";
import {Popup} from "@shared/ui/Popup";
import {TopBar} from "@shared/ui/TopBar";
import {Sidebar} from "@shared/ui/Sidebar";
import {ToggleState} from "@shared/types";
import {ContactSchema} from "@entities/Contact";

interface IEditMemberProps {
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: ContactSchema[],
    removed: ContactSchema[],
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
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    } = useEditRemoved(removed)

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
            liText: 'Add to Messenger',
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
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('removedUsers', setState)}>
                            <HiOutlineArrowLeft/>
                        </DefaultButton>
                        <p>Removed Users</p>
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
                                dropList={RemovedDropDown}
                            /> : <NoResult filter={filter}/>
                        }
                    </div>
                    <Caption/>
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
    )
}

export default EditMembers