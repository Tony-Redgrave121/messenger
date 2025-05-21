import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import useAnimation from "@hooks/useAnimation";
import {
    IAdaptMessenger,
    IAnimationState,
    IEditMessengerForm,
    IMessengerSettings,
    IToggleState,
    SettingsKeys
} from "@appTypes";
import {Buttons} from "@components/buttons";
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineHeart,
    HiOutlineLockClosed,
    HiOutlineShieldCheck,
    HiOutlineTrash,
    HiOutlineUserMinus,
    HiOutlineUsers
} from "react-icons/hi2";
import {SubmitHandler, useForm} from "react-hook-form";
import {InputForm} from "@components/inputForm";
import style from "./style.module.css";
import InputFile from "@components/inputForm/inputFile/InputFile";
import Caption from "@components/caption/Caption";
import messengerService from "@service/MessengerService";
import {useParams} from "react-router-dom";
import EditReactions from "@components/sidebar/rightSidebar/editMessenger/editReactions/EditReactions";
import EditType from "@components/sidebar/rightSidebar/editMessenger/editType/EditType";
import EditModerators from "@components/sidebar/rightSidebar/editMessenger/editMembers/EditModerators";
import EditSubscribers from "@components/sidebar/rightSidebar/editMessenger/editMembers/EditSubscribers";
import openForm from "@utils/logic/openForm";
import EditRemoved from "@components/sidebar/rightSidebar/editMessenger/editMembers/EditRemoved";

interface IEditMessengerProps {
    setState: Dispatch<SetStateAction<IAnimationState>>,
    setEntity: Dispatch<SetStateAction<IAdaptMessenger>>,
    refSidebar: RefObject<HTMLDivElement | null>,
}

const InitialValues: IEditMessengerForm = {
    messenger_id: '',
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
}

const InitialSettings: IMessengerSettings = {
    messenger_setting_type: 'private',
    messenger_setting_id: '',
    messenger_type: '',
    reactions: [],
    reactions_count: 0,
    removed_users: [],
    members: [],
    moderators: [],
    messenger_name: '',
    messenger_desc: '',
    messenger_image: null
}

const EditMessenger: FC<IEditMessengerProps> = ({setState, setEntity, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const refForm = useRef<HTMLDivElement>(null)
    const pictureRef = useRef<File>(null)

    const [settings, setSettings] = useState<IMessengerSettings>(InitialSettings)

    const initialToggleState: IToggleState<SettingsKeys> = {
        reactions: {state: false, mounted: false},
        channelType: {state: false, mounted: false},
        moderators: {state: false, mounted: false},
        subscribers: {state: false, mounted: false},
        removedUsers: {state: false, mounted: false}
    }

    const [formsState, setFormsState] = useState(initialToggleState)

    const refEditReactions = useRef<HTMLDivElement>(null)
    const refEditChannelType = useRef<HTMLDivElement>(null)
    const refEditModerators = useRef<HTMLDivElement>(null)
    const refEditSubscribers = useRef<HTMLDivElement>(null)
    const refEditRemoved = useRef<HTMLDivElement>(null)

    const {id} = useParams()
    useAnimation(isLoaded, setAnimation, setState)

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            pictureRef.current = file[0]
            onChange(file[0])
        }
    }

    const {
        register,
        formState: {errors},
        control,
        setValue,
        handleSubmit,
        watch
    } = useForm({defaultValues: InitialValues})

    useEffect(() => {
        if (!id) return

        const getSettings = async () => {
            messengerService.getMessengerSettings(id)
                .then(res => res.data)
                .then(data => {
                    if (!data.messenger_name) throw data

                    setSettings(data)

                    setValue('messenger_name', data.messenger_name)
                    setValue('messenger_desc', data.messenger_desc)

                    if (data.messenger_image) {
                        pictureRef.current = new Blob([Uint8Array.from(atob(data.messenger_image), c => c.charCodeAt(0))], {type: 'image/png'}) as File
                    }
                })
                .catch(e => console.log(e))
                .finally(() => setIsLoaded(true))
        }

        getSettings().catch(e => console.log(e))
    }, [id, setValue])

    const handleChange: SubmitHandler<IEditMessengerForm> = async (data) => {
        if (!id) return

        try {
            const formData = new FormData()

            formData.append('messenger_id', id)
            formData.append('messenger_name', data.messenger_name)
            formData.append('messenger_image', data.messenger_image as File)
            formData.append('messenger_desc', data.messenger_desc)

            const newData = await messengerService.putMessenger(formData)

            if (newData.status === 200) {
                setSettings(prev => ({
                    ...prev,
                    messenger_name: data.messenger_name,
                    messenger_desc: data.messenger_desc
                }))

                setState(prev => ({
                    ...prev,
                    state: false
                }))

                setEntity(prev => ({
                    ...prev,
                    name: newData.data.messenger_name,
                    desc: newData.data.messenger_desc,
                    image: newData.data.messenger_image,
                }))

                setValue('messenger_image', null)
                setIsLoaded(false)
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
            <SidebarContainer styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <Buttons.DefaultButton foo={() => {
                            setState(prev => ({
                                ...prev,
                                state: false
                            }))
                            setIsLoaded(false)
                        }}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Edit</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <InputFile
                            name="messenger_image"
                            control={control}
                            handleImageChange={handleImageChange}
                            picture={pictureRef.current}/>
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
                        You can provide an optional description for your {settings.messenger_type === "group" ? 'group' : 'channel'}.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton
                            foo={() => openForm('channelType', setFormsState)}
                            text={'Channel Type'}
                            desc={settings.messenger_setting_type}>
                            <HiOutlineLockClosed/>
                        </Buttons.SettingButton>
                        {settings.messenger_type === "channel" &&
                            <Buttons.SettingButton
                                foo={() => openForm('reactions', setFormsState)}
                                text={'Reactions'}
                                desc={settings.reactions.length ? `${settings.reactions.length}/${settings.reactions_count}` : 'Disabled'}>
                                <HiOutlineHeart/>
                            </Buttons.SettingButton>
                        }
                    </div>
                    <Caption>
                        {settings.messenger_type !== "group" ? 'Add a channel chat for comments.' : ''}
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton
                            foo={() => openForm('moderators', setFormsState)}
                            text={'Moderators'}
                            desc={settings.moderators.length}>
                            <HiOutlineShieldCheck/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton
                            foo={() => openForm('subscribers', setFormsState)}
                            text={'Subscribers'}
                            desc={settings.members.length}>
                            <HiOutlineUsers/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton
                            foo={() => openForm('removedUsers', setFormsState)}
                            text={'Removed users'}
                            desc={settings.removed_users.length ? settings.removed_users.length : 'No removed users'}>
                            <HiOutlineUserMinus/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption>
                        {settings.messenger_type !== "group" ? 'You can control access to the channel.' : ''}
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => {
                        }} text={`Delete ${settings.messenger_type === "group" ? "and Leave Group" : "Channel"}`} isRed>
                            <HiOutlineTrash/>
                        </Buttons.SettingButton>
                    </div>
                    <Buttons.CreateButton
                        state={
                            watch('messenger_name') !== settings.messenger_name ||
                            watch('messenger_desc') !== settings.messenger_desc ||
                            watch('messenger_image') !== null
                        }
                        foo={handleSubmit(handleChange)}
                    >
                        <HiOutlineCheck/>
                    </Buttons.CreateButton>
                    <Caption/>
                </div>
                {formsState.reactions.mounted &&
                    <EditReactions
                        state={formsState.reactions}
                        setState={setFormsState}
                        refSidebar={refEditReactions}
                        channelReactions={settings.reactions}
                        messengerSettingsId={settings.messenger_setting_id}
                        setSettings={setSettings}
                    />
                }
                {formsState.channelType.mounted &&
                    <EditType
                        state={formsState.channelType}
                        setState={setFormsState}
                        refSidebar={refEditChannelType}
                        messengerType={settings.messenger_setting_type}
                        messengerUrlType={settings.messenger_type}
                    />
                }
                {formsState.moderators.mounted &&
                    <EditModerators
                        state={formsState.moderators}
                        setState={setFormsState}
                        refSidebar={refEditModerators}
                        moderators={settings.moderators.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                }
                {formsState.subscribers.mounted &&
                    <EditSubscribers
                        state={formsState.subscribers}
                        setState={setFormsState}
                        refSidebar={refEditSubscribers}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                }
                {formsState.removedUsers.mounted &&
                    <EditRemoved
                        state={formsState.removedUsers}
                        setState={setFormsState}
                        refSidebar={refEditRemoved}
                        removed={settings.removed_users.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        setSettings={setSettings}
                    />
                }
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMessenger