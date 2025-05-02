import React, {Dispatch, FC, RefObject, SetStateAction, useState} from 'react'
import {SidebarContainer} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "../../rightSidebar/style.module.css";
import profileStyle from "./style.module.css";
import {ImageBlock} from "@components/sidebar";
import useLoadBlob from "@hooks/useLoadBlob";
import {useAppSelector} from "@hooks/useRedux";
import {Buttons} from "@components/buttons";
import {
    HiOutlinePencil,
    HiOutlineArrowRightOnRectangle,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell,
    HiOutlineServerStack,
    HiOutlineLockClosed,
    HiOutlineQuestionMarkCircle,
    HiOutlineUser,
    HiOutlineArrowLeft,
} from "react-icons/hi2";
import {TopBar} from "@components/sidebar";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState} from "@appTypes";
import Caption from "@components/caption/Caption";

interface IProfileProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const Profile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const {userImg, userName, userId, userBio} = useAppSelector(state => state.user)
    const {image} = useLoadBlob(userImg ? `users/${userId}/${userImg}` : '')

    useAnimation(state.state, setAnimation, setState)

    return (
        <CSSTransition
            in={animation}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <Buttons.DefaultButton foo={() => setState(prev => ({
                            ...prev,
                            state: false
                        }))}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Settings</p>
                    </span>
                    <span>
                        <Buttons.DefaultButton foo={() => {
                        }}>
                            <HiOutlinePencil/>
                        </Buttons.DefaultButton>
                        <Buttons.DefaultButton foo={() => {
                        }}>
                            <HiOutlineArrowRightOnRectangle/>
                        </Buttons.DefaultButton>
                    </span>
                </TopBar>
                <ImageBlock image={image} info={{
                    name: userName,
                    type: "online"
                }}/>
                <ul className={`${style.InfoList} ${profileStyle.ProfileInfoList}`}>
                    <li>
                        <Buttons.SettingButton foo={() => window.navigator.clipboard.writeText(userName)}
                                               text={userName} desc={'Username'}>
                            <HiOutlineUser/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SettingButton
                            foo={() => window.navigator.clipboard.writeText(`http://localhost:3000/chat/${userId}`)}
                            text={userId} desc={'Link'}>
                            <HiOutlinePaperClip/>
                        </Buttons.SettingButton>
                    </li>
                    {userBio &&
                        <li>
                            <Buttons.SettingButton foo={() => window.navigator.clipboard.writeText(userBio)}
                                                   text={userBio} desc={'Bio'}>
                                <HiOutlineExclamationCircle/>
                            </Buttons.SettingButton>
                        </li>
                    }
                </ul>
                <Caption/>
                <ul className={`${style.InfoList} ${profileStyle.ProfileInfoList}`}>
                    <li>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Notifications and Sounds'}>
                            <HiOutlineBell/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Data and Storage'}>
                            <HiOutlineServerStack/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Privacy and Security'}>
                            <HiOutlineLockClosed/>
                        </Buttons.SettingButton>
                    </li>
                </ul>
                <Caption/>
                <ul className={style.InfoList}>
                    <li>
                        <Buttons.SettingButton foo={() => {
                        }} text={'CrowCaw Features'}>
                            <HiOutlineQuestionMarkCircle/>
                        </Buttons.SettingButton>
                    </li>
                </ul>
                <Caption/>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default Profile