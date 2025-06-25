import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {SidebarContainer} from "../../index";
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "../../rightSidebar/style.module.css";
import {ImageBlock} from "../../index";
import useLoadBlob from "@hooks/useLoadBlob";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {Buttons} from "@components/buttons";
import {
    HiOutlinePencil,
    HiOutlineArrowRightOnRectangle,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineArrowLeft,
    HiOutlineTrash,
} from "react-icons/hi2";
import {TopBar} from "../../index";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState, IToggleState, ProfileSettingsKeys} from "@appTypes";
import Caption from "@components/caption/Caption";
import EditProfile from "./editProfile/EditProfile";
import openForm from "@utils/logic/openForm";
import EditPassword from "./editPassword/EditPassword";
import useCopy from "@hooks/useCopy";
import {PopupContainer} from "@components/popup";
import PopupConfirmation from "@components/popup/popupConfirmation/PopupConfirmation";
import {deleteAccount, logout} from "@store/thunks/userThunks";

interface IProfileProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL

const Profile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const initialToggleState: IToggleState<ProfileSettingsKeys> = {
        profile: {state: false, mounted: false},
        password: {state: false, mounted: false}
    }

    const [popup, setPopup] = useState(false)
    const [animation, setAnimation] = useState(false)
    const [formsState, setFormsState] = useState(initialToggleState)

    const {userImg, userName, userId, userBio} = useAppSelector(state => state.user)
    const {image} = useLoadBlob(userImg ? `users/${userId}/${userImg}` : '')

    useAnimation(state.state, setAnimation, setState)
    const refEditProfile = useRef<HTMLDivElement>(null)

    const {handleCopy} = useCopy()
    const dispatch = useAppDispatch()

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
                        <Buttons.DefaultButton foo={() => openForm('profile', setFormsState)}>
                            <HiOutlinePencil/>
                        </Buttons.DefaultButton>
                        <Buttons.DefaultButton foo={() => dispatch(logout())}>
                            <HiOutlineArrowRightOnRectangle/>
                        </Buttons.DefaultButton>
                    </span>
                </TopBar>
                <ImageBlock image={image} info={{
                    name: userName,
                    type: "online"
                }}/>
                <ul className={style.InfoList}>
                    <li>
                        <Buttons.SettingButton
                            foo={() => handleCopy(userName, 'Username copied to clipboard')}
                            text={userName}
                            desc={'Username'}>
                            <HiOutlineUser/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SettingButton
                            foo={() => handleCopy(`${CLIENT_URL}/chat/${userId}`, 'Link copied to clipboard')}
                            text={userId}
                            desc={'Link'}>
                            <HiOutlinePaperClip/>
                        </Buttons.SettingButton>
                    </li>
                    {userBio &&
                        <li>
                            <Buttons.SettingButton
                                foo={() => handleCopy(userBio, 'Bio copied to clipboard')}
                                text={userBio}
                                desc={'Bio'}>
                                <HiOutlineExclamationCircle/>
                            </Buttons.SettingButton>
                        </li>
                    }
                </ul>
                <Caption/>
                <ul className={style.InfoList}>
                    <li>
                        <Buttons.SettingButton
                            foo={() => openForm('password', setFormsState)}
                            text={'Edit Password'}
                        >
                            <HiOutlineLockClosed/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SettingButton
                            foo={() => setPopup(true)}
                            text={'Delete Account'}
                            isRed
                        >
                            <HiOutlineTrash/>
                        </Buttons.SettingButton>
                    </li>
                </ul>
                <Caption/>
                {formsState.profile.mounted &&
                    <EditProfile
                        state={formsState.profile}
                        setState={setFormsState}
                        refSidebar={refEditProfile}
                    />
                }
                {formsState.password.mounted &&
                    <EditPassword
                        state={formsState.password}
                        setState={setFormsState}
                        refSidebar={refEditProfile}
                    />
                }
                <PopupContainer state={popup} handleCancel={() => setPopup(false)}>
                    <PopupConfirmation
                        title='Delete Account'
                        text='Are you sure you want to permanently delete all your data?'
                        confirmButtonText='delete'
                        onCancel={() => setPopup(false)}
                        onConfirm={() => dispatch(deleteAccount({user_id: userId}))}
                    />
                </PopupContainer>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default Profile