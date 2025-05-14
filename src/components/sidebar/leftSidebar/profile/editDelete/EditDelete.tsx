import React, {Dispatch, FC, RefObject, SetStateAction, useState} from 'react'
import {SidebarContainer} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import '../../animation.css'
import style from "./style.module.css";
import {Buttons} from "@components/buttons";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck, HiOutlineExclamationCircle, HiOutlineFaceFrown, HiOutlineTrash,
} from "react-icons/hi2";
import {TopBar} from "@components/sidebar";
import {
    IAnimationState,
    IToggleState,
    ProfileSettingsKeys
} from "@appTypes";
import Caption from "@components/caption/Caption";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {deleteAccount} from "@store/reducers/userReducer";
import openForm from "@utils/logic/openForm";

interface IPasswordProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<ProfileSettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const EditDelete: FC<IPasswordProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)

    useSettingsAnimation(state.state, setAnimation, setState, 'profile')
    const {userId} = useAppSelector(state => state.user)

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
                        <Buttons.DefaultButton foo={() => closeForm('delete', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Delete Account</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer}>
                    <div className={style.TopForm}>
                        <HiOutlineExclamationCircle/>
                        <p>Are you sure you want to delete your account?</p>
                        <Buttons.SettingButton
                            foo={() => dispatch(deleteAccount({user_id: userId}))}
                            text={'Delete Account'}
                            isRed
                        >
                            <HiOutlineTrash/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption>
                        All your data will be permanently removed.
                    </Caption>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditDelete