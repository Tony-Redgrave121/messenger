import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useState} from 'react'
import SidebarContainer from "../../SidebarContainer";
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "../../rightSidebar/style.module.css";
import profileStyle from "./style.module.css";
import ImageBlock from "../../imageBlock/ImageBlock";
import useLoadFile from "../../../../utils/hooks/useLoadFile";
import {useAppSelector} from "../../../../utils/hooks/useRedux";
import Buttons from "../../../buttons/Buttons";
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineArrowRightOnRectangle,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell,
    HiOutlineServerStack,
    HiOutlineLockClosed, HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import TopBar from "../../topBar/TopBar";

interface IProfileProps {
    state: {
        state: boolean,
        mounted: boolean
    },
    setState: Dispatch<SetStateAction<{
        state: boolean,
        mounted: boolean
    }>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const Profile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const {userImg, userName, userId, userBio} = useAppSelector(state => state.user)
    const {image} = useLoadFile(userImg ? `users/${userId}/${userImg}` : '')

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        if (!state.state) timer = setTimeout(() => setState(prev => ({
            ...prev,
            mounted: false
        })), 300)

        setAnimation(state.state)
            
        return () => {
            timer && clearTimeout(timer)
        }
    }, [setState, state])
    
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
                            <HiOutlineXMark/>
                        </Buttons.DefaultButton>
                        <h1>Settings</h1>
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
                        <button onClick={() => window.navigator.clipboard.writeText(userName)}>
                            <HiOutlineExclamationCircle/>
                            <p>{userName}<small className={style.LiType}>Username</small></p>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => window.navigator.clipboard.writeText(`http://localhost:3000/chat/${userId}`)}>
                            <HiOutlinePaperClip/>
                            <p>{userId}<small className={style.LiType}>Link</small></p>
                        </button>
                    </li>
                    {userBio &&
                        <li>
                            <button
                                onClick={() => window.navigator.clipboard.writeText(userBio)}>
                                <HiOutlineExclamationCircle/>
                                <p>{userBio}<small className={style.LiType}>Bio</small></p>
                            </button>
                        </li>
                    }
                </ul>
                <hr/>
                <ul className={`${style.InfoList} ${profileStyle.ProfileInfoList}`}>
                    <li>
                        <button onClick={() => {
                        }}>
                            <HiOutlineBell/>
                            <p>Notifications and Sounds</p>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                        }}>
                            <HiOutlineServerStack/>
                            <p>Data and Storage</p>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                        }}>
                            <HiOutlineLockClosed/>
                            <p>Privacy and Security</p>
                        </button>
                    </li>
                </ul>
                <hr/>
                <ul className={`${style.InfoList} ${profileStyle.ProfileInfoList}`}>
                    <li>
                        <button onClick={() => {
                        }}>
                            <HiOutlineQuestionMarkCircle/>
                            <p>CrowCaw Features</p>
                        </button>
                    </li>
                </ul>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default Profile