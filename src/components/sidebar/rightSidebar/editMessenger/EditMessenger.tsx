import React, {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState, IEditMessengerForm} from "@appTypes";
import {Buttons} from "@components/buttons";
import {HiOutlineArrowLeft, HiOutlineBell} from "react-icons/hi2";
import {useForm} from "react-hook-form";
import {InputForm} from "@components/inputForm";
import style from "./style.module.css";
import InputFile from "@components/inputForm/inputImage/InputFile";

interface IEditMessengerProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const InitialValues: IEditMessengerForm = {
    messenger_id: '',
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
    moderators: []
}

const EditMessenger: FC<IEditMessengerProps> = ({state, setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    useAnimation(state.state, setAnimation, setState)
    const refForm = useRef<HTMLDivElement>(null)
    const [picture, setPicture] = useState<File | null>(null)
    const [settings, setSettings] = useState({})

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0])
            onChange(file[0])
        }
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        trigger,
        watch,
        control
    } = useForm({defaultValues: InitialValues})

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
                        <Buttons.DefaultButton foo={() => setState(prev => ({
                            ...prev,
                            state: false
                        }))}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Edit</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.Form}>
                        <InputFile name="messenger_image" control={control} handleImageChange={handleImageChange} picture={picture}/>
                        <InputForm errors={errors} field="messenger_name">
                            <input
                                type="text"
                                id="messenger_name"
                                placeholder="Channel name"
                                {...register('messenger_name', {
                                    required: 'Messenger name is required'
                                })}
                            />
                        </InputForm>
                        <InputForm errors={errors} field="messenger_desc">
                            <input
                                type="text"
                                id="messenger_desc"
                                placeholder="Description"
                                {...register('messenger_desc')}
                            />
                        </InputForm>
                    </div>
                    <hr/>
                    <div className={style.Form}>
                        {/*<Buttons.SwitchSettingButton text={'Notifications'} foo={() => setSettings(!settings)} state={settings}>*/}
                        {/*    <HiOutlineBell/>*/}
                        {/*</Buttons.SwitchSettingButton>*/}
                    </div>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMessenger