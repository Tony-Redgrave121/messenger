import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState, IEditMessengerForm} from "@appTypes";
import {Buttons} from "@components/buttons";
import {
    HiOutlineArrowLeft, HiOutlineHeart, HiOutlineLockClosed,
    HiOutlineShieldCheck, HiOutlineTrash,
    HiOutlineUserMinus,
    HiOutlineUsers
} from "react-icons/hi2";
import {useForm} from "react-hook-form";
import {InputForm} from "@components/inputForm";
import style from "./style.module.css";
import InputFile from "@components/inputForm/inputImage/InputFile";
import Caption from "@components/caption/Caption";
import messengerService from "../../../../service/MessengerService";
import {data, useParams} from "react-router-dom";

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

    const {id} = useParams()

    useEffect(() => {
        if (!id) return

        const  getSettings = async () => {
            messengerService.getMessengerSettings(id)
                .then(res => res.data)
                .then(data => setSettings(data))
                .catch(e => console.log(e))
        }

        getSettings().catch(e => console.log(e))
    }, [id])

    console.log(settings)

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
                    <div className={style.TopForm}>
                        <InputFile name="messenger_image" control={control} handleImageChange={handleImageChange}
                                   picture={picture}/>
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
                    <Caption>
                        You can provide an optional description for your channel.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Channel Type'} desc={'Private'}>
                            <HiOutlineLockClosed/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Reactions'} desc={'Disabled'}>
                            <HiOutlineHeart/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption>
                        Add a channel chat for comments.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Moderators'} desc={'1'}>
                            <HiOutlineShieldCheck/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Subscribers'} desc={'2'}>
                            <HiOutlineUsers/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Removed users'} desc={'No removed users'}>
                            <HiOutlineUserMinus/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption>
                        You can control access to the channel.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Delete Channel'} isRed>
                            <HiOutlineTrash/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption/>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMessenger