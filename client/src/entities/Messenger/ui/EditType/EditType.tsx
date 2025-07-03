import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group"
import {SettingsKeys} from "@appTypes"
import style from "./style.module.css"
import {HiOutlineArrowLeft, HiOutlineTrash} from "react-icons/hi2"
import {Caption} from "@shared/ui/Caption";
import {closeForm} from "@shared/lib";
import MessengerSettingsService from "../../../../services/MessengerSettingsService";
import {useNavigate, useParams} from "react-router-dom"
import useCopy from "../../../Message/lib/hooks/useCopy";
import {DefaultButton, SettingButton} from "@shared/ui/Button";
import {Radio} from "@shared/ui/Input";
import {TopBar} from "@shared/ui/TopBar";
import {Sidebar} from "@shared/ui/Sidebar";
import {ToggleState} from "@shared/types";

interface IEditTypeProps {
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<SettingsKeys>>>,
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
    const [newMessengerType, setNewMessengerType] = useState('private')
    const [newMessengerLink, setNewMessengerLink] = useState('')

    const refForm = useRef<HTMLDivElement>(null)

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
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('channelType', setState)}>
                            <HiOutlineArrowLeft/>
                        </DefaultButton>
                        <p>Channel Type</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.FormBlock}>
                        <p>Channel Type</p>
                        <Radio
                            key='private'
                            foo={() => handleMessengerType('private')}
                            state={newMessengerType === 'private'}
                            text='Private Channel'
                            desc='Private channels can only be joined via an invite link.'
                        />
                        <Radio
                            key='public'
                            foo={() => handleMessengerType('public')}
                            state={newMessengerType === 'public'}
                            text='Public Channel'
                            desc='Public channels can be found in search, anyone can join them.'
                        />
                    </div>
                    <Caption/>
                    <div className={style.FormBlock}>
                        <SettingButton
                            text={window.location.href}
                            desc='People can join your channel by following this link. You can revoke the link any time.'
                            foo={() => {
                                handleCopy(window.location.href, 'Link copied to clipboard')
                            }}
                        />
                        <SettingButton
                            foo={handleRevokeLink}
                            text='Revoke Link'
                            isRed>
                            <HiOutlineTrash/>
                        </SettingButton>
                    </div>
                    <Caption/>
                </div>
            </Sidebar>
        </CSSTransition>
    )
}

export default EditType