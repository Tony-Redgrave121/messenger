import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IContact, IMessengerSettings, IToggleState, SettingsKeys} from "@appTypes"
import style from "./shared.module.css"
import {Buttons} from "@components/buttons"
import {
    HiOutlineArrowLeft, HiOutlineChatBubbleLeft, HiOutlineShieldExclamation, HiOutlineTrash,
    HiOutlineUserPlus
} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import useSearch from "@hooks/useSearch";
import {SearchBlock} from "@components/searchBlock";
import {PopupContainer} from "@components/popup";
import NoResult from "@components/noResult/NoResult";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";
import PopupEditModerators from "@components/popup/popupEditMembers/PopupEditModerators";
import MessengerService from "@service/MessengerService";
import {useParams} from "react-router-dom";

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
    const [animation, setAnimation] = useState(false)
    const [newMembers, setNewMembers] = useState<IContact[]>([])
    useSettingsAnimation(state.state, setAnimation, setState, 'moderators')

    const [popup, setPopup] = useState(false)

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(moderators, 'user_id')

    useEffect(() => {
        setNewMembers(moderators)
    }, [moderators])

    const handleCancel = () => {
        setPopup(false)

        setTimeout(() => setPopup(false), 300)
    }

    const {id} = useParams()

    const handleDismissModerator = async (user_id: string) => {
        if (!id) return

        try {
            const newModerators = await MessengerService.putMessengerModerator('member', user_id, id)

            if (newModerators.data.message) return

            setSettings(prev => ({
                ...prev,
                moderators: [...prev.moderators.filter(moderator =>
                    moderator.member_id !== newModerators.data.member_id
                )]
            }))

            handleCancel()
        } catch (error) {
            console.log(error)
        }
    }

    const ModeratorDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineChatBubbleLeft/>,
            liText: 'Send Message',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Remove from group',
            liFoo: () => {
            }
        },
        {
            liChildren: <HiOutlineShieldExclamation/>,
            liText: 'Dismiss Moderator',
            liFoo: () => handleDismissModerator(user_id)
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