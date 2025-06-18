import {Dispatch, FC, RefObject, SetStateAction} from 'react'
import {SidebarContainer, TopBar} from "../../../index"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IContact, IMessengerSettings, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft,
    HiOutlineMinusCircle,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import NoResult from "@components/noResult/NoResult";
import MembersList from "./membersList/MembersList";
import PopupEditSubscribers from "@components/popup/popupEditMembers/PopupEditSubscribers";
import closeForm from "@utils/logic/closeForm";
import useEditSettings from "@utils/hooks/settings/useEditSettings";
import useEditSubscribers from "@utils/hooks/settings/useEditSubscribers";

interface IEditSubscribersProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const EditSubscribers: FC<IEditSubscribersProps> = (
    {
        setState,
        refSidebar,
        state,
        members,
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
    } = useEditSubscribers(state, setState, members)

    const {
        deleteFromGroup,
        handleCancel,
        setPopup,
        popup
    } = useEditSettings(setSettings)

    const SubscribersDropDown = (userId: string) => [
        {
            liChildren: <HiOutlineMinusCircle/>,
            liText: 'Remove from group',
            liFoo: () => deleteFromGroup(userId)
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
                        <Buttons.DefaultButton foo={() => closeForm('subscribers', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Add Subscribers</p>
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
                                dropList={SubscribersDropDown}
                            /> : <NoResult filter={filter}/>
                        }
                    </div>
                    <Caption/>
                    <PopupContainer state={popup} handleCancel={handleCancel}>
                        <PopupEditSubscribers handleCancel={handleCancel} setSettings={setSettings}/>
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditSubscribers