import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "../../../index"
import {CSSTransition} from "react-transition-group"
import {IAnimationState, IToggleState, SettingsKeys} from "@appTypes"
import style from "./style.module.css"
import {Buttons} from "@components/buttons"
import {HiOutlineArrowLeft, HiOutlineTrash} from "react-icons/hi2"
import Caption from "@components/caption/Caption";
import closeForm from "@utils/logic/closeForm";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import MessengerSettingsService from "@service/MessengerSettingsService";
import {useNavigate, useParams} from "react-router-dom"
import useCopy from "@hooks/useCopy";

interface IEditTypeProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    messengerType: 'private' | 'public',
    messengerUrlType: string,
}

const EditType: FC<IEditTypeProps> = (
    {
        setState,
        refSidebar,
        state,
        messengerType,
        messengerUrlType
    }
) => {
    const [animation, setAnimation] = useState(false)
    const [newMessengerType, setNewMessengerType] = useState('private')
    const [newMessengerLink, setNewMessengerLink] = useState('')

    const refForm = useRef<HTMLDivElement>(null)
    useSettingsAnimation(state.state, setAnimation, setState, 'channelType')

    const {messengerId} = useParams()
    const navigate = useNavigate()
    const {handleCopy} = useCopy()

    useEffect(() => {
        if (!messengerId) return

        setNewMessengerType(messengerType)
        setNewMessengerLink(messengerId)
    }, [messengerType, messengerId])

    const handleMessengerType = async (type: string) => {
        if (!newMessengerLink) return

        try {
            await MessengerSettingsService.putMessengerType(type, newMessengerLink)

            setNewMessengerType(type)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRevokeLink = async () => {
        if (!newMessengerLink) return

        try {
            const data = await MessengerSettingsService.putMessengerLink(newMessengerLink)

            setNewMessengerLink(data.data.messenger_id)
            navigate(`/${messengerUrlType}/${data.data.messenger_id}`)
        } catch (error) {
            console.log(error)
        }
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
                        <Buttons.DefaultButton foo={() => closeForm('channelType', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Channel Type</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.FormBlock}>
                        <p>Channel Type</p>
                        <Buttons.RadioButton
                            key='private'
                            foo={() => handleMessengerType('private')} state={newMessengerType === 'private'}
                            text='Private Channel'
                            desc='Private channels can only be joined via an invite link.'/>
                        <Buttons.RadioButton
                            key='public'
                            foo={() => handleMessengerType('public')} state={newMessengerType === 'public'}
                            text='Public Channel'
                            desc='Public channels can be found in search, anyone can join them.'/>
                    </div>
                    <Caption/>
                    <div className={style.FormBlock}>
                        <Buttons.SettingButton
                            text={window.location.href}
                            desc='People can join your channel by following this link. You can revoke the link any time.'
                            foo={() =>  handleCopy(window.location.href, 'Link copied to clipboard')}
                        />
                        <Buttons.SettingButton
                            foo={handleRevokeLink}
                            text='Revoke Link'
                            isRed>
                            <HiOutlineTrash/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption/>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditType