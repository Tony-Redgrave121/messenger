import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {SidebarContainer} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import '../../animation.css'
import style from "./style.module.css";
import {Buttons} from "@components/buttons";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
} from "react-icons/hi2";
import {TopBar} from "@components/sidebar";
import {
    IAnimationState,
    IEditPasswordForm,
    IToggleState,
    ProfileSettingsKeys
} from "@appTypes";
import Caption from "@components/caption/Caption";
import {InputForm} from "@components/inputForm";
import {SubmitHandler, useForm} from "react-hook-form";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import UserService from "@service/UserService";
import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";

interface IPasswordProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<ProfileSettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const InitialValues: IEditPasswordForm = {
    user_id: '',
    user_password: '',
    user_password_new: ''
}

const EditPassword: FC<IPasswordProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const refForm = useRef<HTMLDivElement>(null)

    useSettingsAnimation(state.state, setAnimation, setState, 'profile')
    const {userId} = useAppSelector(state => state.user)

    const dispatch = useAppDispatch()

    const handleChange: SubmitHandler<IEditPasswordForm> = async (data) => {
        try {
            const formData = new FormData()

            formData.append('user_id', userId)
            formData.append('user_password', data.user_password)
            formData.append('user_password_new', data.user_password_new)

            const newData = await UserService.putPassword(userId, formData)

            dispatch(setPopupMessageState(true))
            dispatch(setPopupMessageChildren(newData.data.message))

            if (newData.data.status === 200) closeForm('password', setState)
        } catch (error) {
            console.log(error)
        }
    }

    const {
        register,
        formState: {errors},
        handleSubmit,
        watch
    } = useForm({defaultValues: InitialValues})

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
                        <Buttons.DefaultButton foo={() => closeForm('password', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Edit Password</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <InputForm errors={errors} field="user_password">
                            <input
                                type="text"
                                id="user_password"
                                placeholder="Current Password"
                                {...register('user_password', {
                                    required: "Current password is required",
                                    pattern: {
                                        value: /^.{8,}$/,
                                        message: "Password must be at least 8 characters long"
                                    }
                                })}
                            />
                        </InputForm>
                        <InputForm errors={errors} field="user_password_new">
                            <input
                                type="text"
                                id="user_password_new"
                                placeholder="New Password"
                                {...register('user_password_new', {
                                    required: "New password is required",
                                    pattern: {
                                        value: /^.{8,}$/,
                                        message: "Password must be at least 8 characters long"
                                    },
                                    validate: value => value !== watch('user_password') || "New password must be different"
                                })}
                            />
                        </InputForm>
                    </div>
                    <Caption>
                        Use at least 8 characters with a mix of letters, numbers, and symbols to increase password strength
                    </Caption>
                    <Buttons.CreateButton
                        state={
                            watch('user_password') !== '' &&
                            watch('user_password_new') !== ''
                        }
                        foo={handleSubmit(handleChange)}
                    >
                        <HiOutlineCheck/>
                    </Buttons.CreateButton>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditPassword