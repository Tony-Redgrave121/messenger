import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import useAnimation from "@hooks/useAnimation"
import {IAnimationState, IContact, IDropDownList, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import useSearch from "@hooks/useSearch";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import NoResult from "@components/noResult/NoResult";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";
import PopupEditSubscribers from "@components/popup/popupEditMembers/PopupEditSubscribers";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";

interface IEditSubscribersProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    dropList: (user_id: string) => IDropDownList[]
}

const EditSubscribers: FC<IEditSubscribersProps> = ({setState, refSidebar, state, members, dropList}) => {
    const [animation, setAnimation] = useState(false)
    const [newSubscribers, setNewSubscribers] = useState<IContact[]>([])
    useSettingsAnimation(state.state, setAnimation, setState, 'subscribers')

    const [popup, setPopup] = useState(false)

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(members, 'user_id')

    const handleCancel = () => {
        setPopup(false)

        setTimeout(() => setPopup(false), 300)
    }

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
                                dropList={dropList}
                            /> : <NoResult filter={filter}/>
                        }
                    </div>
                    <Caption/>
                    <PopupContainer state={popup} handleCancel={handleCancel}>
                        <PopupEditSubscribers handleCancel={handleCancel}/>
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditSubscribers