import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group";
import './profile.animation.css'
import style from "@widgets/RightSidebar/ui/style.module.css";
import {ImageBlock} from "../../../ImageBlock";
import useLoadBlob from "@shared/lib/hooks/useLoadBlob/useLoadBlob";
import {useAppDispatch, useAppSelector, openForm} from "@shared/lib";
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
import {Caption} from "@shared/ui/Caption";
import {EditProfile} from "../../index";
import {EditPassword} from "../../index";
import useCopy from "@entities/Message/lib/hooks/useCopy";
import PopupConfirmation from "../PopupConfirmation/PopupConfirmation";
import {deleteAccount, logout} from "@entities/User/lib/thunk/userThunk";
import {DefaultButton, SettingButton} from "@shared/ui/Button";
import {Popup} from "@shared/ui/Popup";
import {TopBar} from "@shared/ui/TopBar";
import {Sidebar} from "@shared/ui/Sidebar";
import {ToggleState} from "@shared/types";
import ProfileKeys from "../../model/types/ProfileKeys";

interface IProfileProps {
    state: boolean,
    setState: Dispatch<SetStateAction<boolean>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const CLIENT_URL = process.env.VITE_CLIENT_URL

const Profile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const initialToggleState: ToggleState<ProfileKeys> = {
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
            classNames='profile-node'
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