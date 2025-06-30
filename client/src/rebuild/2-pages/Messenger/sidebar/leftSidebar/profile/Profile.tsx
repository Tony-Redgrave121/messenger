import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "../../rightSidebar/style.module.css";
import {ImageBlock} from "../../index";
import useLoadBlob from "@utils/hooks/useLoadBlob";
import {useAppDispatch, useAppSelector, openForm} from "../../../../../shared/lib";
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
import {ProfileSettingsKeys} from "@appTypes";
import {Caption} from "../../../../../shared/ui/Caption";
import EditProfile from "./editProfile/EditProfile";
import EditPassword from "./editPassword/EditPassword";
import useCopy from "@utils/hooks/useCopy";
import PopupConfirmation from "@components/popup/popupConfirmation/PopupConfirmation";
import {deleteAccount, logout} from "@store/thunks/userThunks";
import {DefaultButton, SettingButton} from "../../../../../shared/ui/Button";
import {Popup} from "../../../../../shared/ui/Popup";
import {TopBar} from "../../../../../shared/ui/TopBar";
import {Sidebar} from "../../../../../shared/ui/Sidebar";
import {ToggleState} from "../../../../../shared/types";

interface IProfileProps {
    state: boolean,
    setState: Dispatch<SetStateAction<boolean>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL

const Profile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const initialToggleState: ToggleState<ProfileSettingsKeys> = {
        profile: false,
        password: false
    }

    const [popup, setPopup] = useState(false)
    const [formsState, setFormsState] = useState(initialToggleState)

    const {userImg, userName, userId, userBio} = useAppSelector(state => state.user)
    const {image} = useLoadBlob(userImg ? `users/${userId}/${userImg}` : '')

    const refEditProfile = useRef<HTMLDivElement>(null)

    const {handleCopy} = useCopy()
    const dispatch = useAppDispatch()

    return (
        <CSSTransition
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <DefaultButton foo={() => setState(false)}>
                            <HiOutlineArrowLeft/>
                        </DefaultButton>
                        <p>Settings</p>
                    </span>
                    <span>
                        <DefaultButton foo={() => openForm('profile', setFormsState)}>
                            <HiOutlinePencil/>
                        </DefaultButton>
                        <DefaultButton foo={() => dispatch(logout())}>
                            <HiOutlineArrowRightOnRectangle/>
                        </DefaultButton>
                    </span>
                </TopBar>
                <ImageBlock image={image} info={{
                    name: userName,
                    type: "online"
                }}/>
                <ul className={style.InfoList}>
                    <li>
                        <SettingButton
                            foo={() => handleCopy(userName, 'Username copied to clipboard')}
                            text={userName}
                            desc={'Username'}>
                            <HiOutlineUser/>
                        </SettingButton>
                    </li>
                    <li>
                        <SettingButton
                            foo={() => handleCopy(`${CLIENT_URL}/chat/${userId}`, 'Link copied to clipboard')}
                            text={userId}
                            desc={'Link'}>
                            <HiOutlinePaperClip/>
                        </SettingButton>
                    </li>
                    {userBio &&
                        <li>
                            <SettingButton
                                foo={() => handleCopy(userBio, 'Bio copied to clipboard')}
                                text={userBio}
                                desc={'Bio'}>
                                <HiOutlineExclamationCircle/>
                            </SettingButton>
                        </li>
                    }
                </ul>
                <Caption/>
                <ul className={style.InfoList}>
                    <li>
                        <SettingButton
                            foo={() => openForm('password', setFormsState)}
                            text={'Edit Password'}
                        >
                            <HiOutlineLockClosed/>
                        </SettingButton>
                    </li>
                    <li>
                        <SettingButton
                            foo={() => setPopup(true)}
                            text={'Delete Account'}
                            isRed
                        >
                            <HiOutlineTrash/>
                        </SettingButton>
                    </li>
                </ul>
                <Caption/>
                <EditProfile
                    state={formsState.profile}
                    setState={setFormsState}
                    refSidebar={refEditProfile}
                />
                <EditPassword
                    state={formsState.password}
                    setState={setFormsState}
                    refSidebar={refEditProfile}
                />
                <Popup state={popup} handleCancel={() => setPopup(false)}>
                    <PopupConfirmation
                        title='Delete Account'
                        text='Are you sure you want to permanently delete all your data?'
                        confirmButtonText='delete'
                        onCancel={() => setPopup(false)}
                        onConfirm={() => dispatch(deleteAccount({user_id: userId}))}
                    />
                </Popup>
            </Sidebar>
        </CSSTransition>
    )
}

export default Profile