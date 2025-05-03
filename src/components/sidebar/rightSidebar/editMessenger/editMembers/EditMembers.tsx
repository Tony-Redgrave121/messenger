import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import useAnimation from "@hooks/useAnimation"
import {IAnimationState, IContact, IDropDownList} from "@appTypes"
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
import PopupEditMembers from "@components/popup/popupEditMembers/PopupEditMembers";
import NoResult from "@components/noResult/NoResult";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";

interface IEditMemberProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    moderators: IContact[],
    dropList: IDropDownList[],
    title: string
}

const EditMembers: FC<IEditMemberProps> = ({setState, refSidebar, state, members, moderators, dropList, title}) => {
    const [animation, setAnimation] = useState(false)
    const [newMembers, setNewMembers] = useState<IContact[]>([])
    useAnimation(state.state, setAnimation, setState)

    const [popup, setPopup] = useState(false)

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(moderators, 'user_name')

    useEffect(() => {
        setNewMembers(moderators)
    }, [moderators])

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
                        <Buttons.DefaultButton foo={() => {
                            setState(prev => ({
                                ...prev,
                                state: false
                            }))
                        }}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>{title}</p>
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
                        <PopupEditMembers
                            handleCancel={handleCancel}
                            members={members}
                            moderators={newMembers}
                            setMembers={setNewMembers}
                            title={title}
                        />
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMembers