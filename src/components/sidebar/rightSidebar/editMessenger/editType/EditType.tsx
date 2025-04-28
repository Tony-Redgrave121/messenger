import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar"
import {CSSTransition} from "react-transition-group"
import useAnimation from "@hooks/useAnimation"
import {IAnimationState} from "@appTypes"
import style from "./style.module.css"
import {Buttons} from "@components/buttons"
import {HiOutlineArrowLeft, HiOutlineTrash} from "react-icons/hi2"
import Caption from "@components/caption/Caption";

interface IEditTypeProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    channelType: 'private' | 'public'
}

const EditType: FC<IEditTypeProps> = ({setState, refSidebar, state, channelType}) => {
    const [animation, setAnimation] = useState(false)
    const [newChannelType, setNewChannelType] = useState('private')

    const refForm = useRef<HTMLDivElement>(null)
    useAnimation(state.state, setAnimation, setState)

    useEffect(() => {
        setNewChannelType(channelType)
    }, [channelType])

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
                        <p>Channel Type</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <p>Channel Type</p>
                        <Buttons.RadioButton
                            key='private'
                            foo={() => setNewChannelType('private')} state={newChannelType === 'private'}
                            text='Private Channel'
                            desc='Private channels can only be joined via an invite link.'/>
                        <Buttons.RadioButton
                            key='public'
                            foo={() => setNewChannelType('public')} state={newChannelType === 'public'}
                            text='Public Channel'
                            desc='Public channels can be found in search, anyone can join them.'/>
                    </div>
                    <Caption/>
                    <div>
                        <Buttons.SettingButton
                            text={window.location.href}
                            desc='People can join your channel by following this link. You can revoke the link any time.'/>
                        <Buttons.SettingButton
                            foo={() => {
                            }}
                            text={'Revoke Link'}
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