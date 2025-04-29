import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import useAnimation from "@hooks/useAnimation"
import {IAnimationState, IContact} from "@appTypes"
import style from "./style.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft,
    HiOutlineUserMinus,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import useSearch from "@hooks/useSearch";
import {ContactList} from "@components/contacts";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import PopupEditMembers from "@components/popup/popupEditMembers/PopupEditMembers";
import NoResult from "@components/noResult/NoResult";

interface IEditMemberProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    members: IContact[],
    moderators: IContact[]
}

const EditMembers: FC<IEditMemberProps> = ({setState, refSidebar, state, members, moderators}) => {
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
                        <p>Moderators</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SearchBlock foo={handleInput} ref={searchRef}/>
                        <span className={style.CreateButton}>
                            <Buttons.InterButton foo={() => setPopup(true)}>
                                <HiOutlineUserPlus/>
                            </Buttons.InterButton>
                        </span>
                    </div>
                    <Caption/>
                    <div>
                        {filteredArr.length > 0 ?
                            <ContactList
                                contacts={filteredArr}
                                text='Moderators'
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
                        />
                    </PopupContainer>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMembers