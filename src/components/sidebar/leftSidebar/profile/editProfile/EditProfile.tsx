import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
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
    IEditProfileForm,
    IProfileSettings,
    IToggleState,
    ProfileSettingsKeys
} from "@appTypes";
import Caption from "@components/caption/Caption";
import InputFile from "@components/inputForm/inputFile/InputFile";
import {InputForm} from "@components/inputForm";
import {SubmitHandler, useForm} from "react-hook-form";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import closeForm from "@utils/logic/closeForm";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setUserName, setUserImg, setUserBio} from "@store/reducers/userReducer";
import UserService from "@service/UserService";

interface IProfileProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<ProfileSettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const InitialValues: IEditProfileForm = {
    user_id: '',
    user_name: '',
    user_img: null,
    user_bio: '',
}

const InitialSettings: IProfileSettings = {
    user_id: '',
    user_name: '',
    user_img: null,
    user_bio: '',
}

const EditProfile: FC<IProfileProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const [settings, setSettings] = useState<IProfileSettings>(InitialSettings)

    const refForm = useRef<HTMLDivElement>(null)
    const pictureRef = useRef<File>(null)

    useSettingsAnimation(state.state, setAnimation, setState, 'profile')
    const {userId} = useAppSelector(state => state.user)

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            pictureRef.current = file[0]
            onChange(file[0])
        }
    }

    const dispatch = useAppDispatch()

    const {
        register,
        formState: {errors},
        control,
        setValue,
        handleSubmit,
        watch
    } = useForm({defaultValues: InitialValues})

    useEffect(() => {
        const handleProfileSettings = async () => {
            try {
                const profileSettings = await UserService.getProfile(userId)

                if (profileSettings.status === 200) {
                    setSettings(profileSettings.data)

                    setValue('user_name', profileSettings.data.user_name)
                    setValue('user_bio', profileSettings.data.user_bio)

                    const user_img = profileSettings.data.user_img

                    if (user_img && typeof user_img === 'string') {
                        pictureRef.current = new Blob([Uint8Array.from(atob(user_img), c => c.charCodeAt(0))], {type: 'image/png'}) as File
                    }
                }
            } catch (error) {
                console.log(error)
            }         
        }
        
        handleProfileSettings()
    }, [setValue, userId])

    const handleChange: SubmitHandler<IEditProfileForm> = async (data) => {
        try {
            const formData = new FormData()

            formData.append('user_id', userId)
            formData.append('user_name', data.user_name)
            formData.append('user_img', data.user_img as File)
            formData.append('user_bio', data.user_bio)

            const newData = await UserService.putProfile(userId, formData)

            if (newData.status === 200) {
                dispatch(setUserName(newData.data.user_name))
                dispatch(setUserBio(newData.data.user_bio))
                dispatch(setUserImg(newData.data.user_img))

                setValue('user_img', null)
                closeForm('profile', setState)
            }
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
            <SidebarContainer styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <Buttons.DefaultButton foo={() => closeForm('profile', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Edit Profile</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <InputFile
                            name="user_img"
                            control={control}
                            handleImageChange={handleImageChange}
                            picture={pictureRef.current}/>
                        <InputForm errors={errors} field="user_name">
                            <input
                                type="text"
                                id="user_name"
                                placeholder="User name"
                                {...register('user_name', {
                                    required: 'User name is required'
                                })}
                            />
                        </InputForm>
                        <InputForm errors={errors} field="user_bio">
                            <input
                                type="text"
                                id="user_bio"
                                placeholder="User Bio"
                                {...register('user_bio')}
                            />
                        </InputForm>
                    </div>
                    <Caption>
                        Any details such as age, occupation or city.
                        <br/>
                        Example: 23 y.o. designer from San Francisco
                    </Caption>
                    <Buttons.CreateButton
                        state={
                            watch('user_name') !== settings.user_name ||
                            watch('user_bio') !== settings.user_bio ||
                            watch('user_img') !== null
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

export default EditProfile