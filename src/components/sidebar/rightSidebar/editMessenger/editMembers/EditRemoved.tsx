import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IContact, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft, HiOutlineChatBubbleLeft, HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import useSearch from "@hooks/useSearch";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import PopupEditMembers from "@components/popup/popupEditMembers/PopupEditMembers";
import NoResult from "@components/noResult/NoResult";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";

interface IEditMemberProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    removed: IContact[]
}

const EditMembers: FC<IEditMemberProps> = (
    {
        setState,
        refSidebar,
        state,
        members,
        removed
    }
) => {
    const [animation, setAnimation] = useState(false)
    const [newMembers, setNewMembers] = useState<IContact[]>([])
    useSettingsAnimation(state.state, setAnimation, setState, 'removedUsers')

    const [popup, setPopup] = useState(false)

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(removed, 'user_id')

    useEffect(() => {
        setNewMembers(removed)
    }, [removed])

    const handleCancel = () => {
        setPopup(false)
        setTimeout(() => setPopup(false), 300)
    }

    const RemovedDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineChatBubbleLeft/>,
            liText: 'Send Message',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineUserPlus/>,
            liText: 'Add to Group',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Delete',
            liFoo: () => {
            }
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
                        <PopupEditMembers
                            handleCancel={handleCancel}
                            members={members}
                            moderators={newMembers}
                            setMembers={setNewMembers}
                            title='Removed Users'
                            onClick={() => {}}
                        />
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMembers