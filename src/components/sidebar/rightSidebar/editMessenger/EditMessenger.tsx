import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState, IEditMessengerForm, IMessengerSettings} from "@appTypes";
import {Buttons} from "@components/buttons";
import {
    HiOutlineArrowLeft, HiOutlineChatBubbleLeft, HiOutlineHeart, HiOutlineLockClosed,
    HiOutlineShieldCheck, HiOutlineShieldExclamation, HiOutlineTrash,
    HiOutlineUserMinus,
    HiOutlineUsers
} from "react-icons/hi2";
import {useForm} from "react-hook-form";
import {InputForm} from "@components/inputForm";
import style from "./style.module.css";
import InputFile from "@components/inputForm/inputImage/InputFile";
import Caption from "@components/caption/Caption";
import messengerService from "../../../../service/MessengerService";
import {useParams} from "react-router-dom";
import EditReactions from "@components/sidebar/rightSidebar/editMessenger/editReactions/EditReactions";
import EditType from "@components/sidebar/rightSidebar/editMessenger/editType/EditType";
import EditMembers from "@components/sidebar/rightSidebar/editMessenger/editMembers/EditMembers";

interface IEditMessengerProps {
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

const InitialSettings: IMessengerSettings = {
    messenger_setting_type: 'private',
    reactions: [],
    reactions_count: 0,
    removed_users: [],
    members: [],
    moderators: [],
    messenger_name: '',
    messenger_desc: '',
    messenger_image: null
}

const EditMessenger: FC<IEditMessengerProps> = ({setState, refSidebar}) => {
    const [animation, setAnimation] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const refForm = useRef<HTMLDivElement>(null)
    const [picture, setPicture] = useState<File | null>(null)
    const [settings, setSettings] = useState(InitialSettings)
    const [newSettings, setNewSettings] = useState({
        messenger_name: '',
        messenger_desc: ''
    })

    const [editReactions, setEditReactions] = useState({
        state: false,
        mounted: false
    })
    const refEditReactions = useRef<HTMLDivElement>(null)

    const [editChannelType, setEditChannelType] = useState({
        state: false,
        mounted: false
    })
    const refEditChannelType = useRef<HTMLDivElement>(null)

    const [editModerators, setEditModerators] = useState({
        state: false,
        mounted: false
    })
    const refEditModerators = useRef<HTMLDivElement>(null)

    const [editSubscribers, setEditSubscribers] = useState({
        state: false,
        mounted: false
    })
    const refEditSubscribers = useRef<HTMLDivElement>(null)

    const {id} = useParams()
    useAnimation(isLoaded, setAnimation, setState)

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0])
            onChange(file[0])
        }
    }

    const {
        register,
        formState: {errors},
        control,
        setValue
    } = useForm({defaultValues: InitialValues})

    useEffect(() => {
        if (!id) return

        const getSettings = async () => {
            messengerService.getMessengerSettings(id)
                .then(res => res.data)
                .then(data => {
                    if (!data.messenger_name) throw data

                    setSettings(data)
                    setNewSettings({
                        messenger_name: data.messenger_name,
                        messenger_desc: data.messenger_desc
                    })

                    setValue('messenger_name', data.messenger_name)
                    setValue('messenger_desc', data.messenger_desc)

                    if (data.messenger_image) {
                        const blob = new Blob([Uint8Array.from(atob(data.messenger_image), c => c.charCodeAt(0))], {type: 'image/png'}) as File
                        setPicture(blob)
                    }
                })
                .catch(e => console.log(e))
                .finally(() => setIsLoaded(true))
        }

        getSettings().catch(e => console.log(e))
    }, [id, setValue])

    const ModeratorDropDown = [
        {
            liChildren: <HiOutlineChatBubbleLeft/>,
            liText: 'Send Message',
            liFoo: () => {}
        },
        {
            liChildren: <HiOutlineShieldExclamation/>,
            liText: 'Remove from group',
            liFoo: () => {}
        },
        {
            liChildren: <HiOutlineTrash/>,
            liText: 'Dismiss Moderator',
            liFoo: () => {}
        }
    ]

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
                                value={newSettings.messenger_desc}
                                {...register('messenger_desc')}
                            />
                        </InputForm>
                    </div>
                    <Caption>
                        You can provide an optional description for your channel.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => setEditChannelType({
                            state: true,
                            mounted: true
                        })} text={'Channel Type'} desc={settings.messenger_setting_type}>
                            <HiOutlineLockClosed/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => setEditReactions({
                            state: true,
                            mounted: true
                        })} text={'Reactions'} desc={settings.reactions.length ? `${settings.reactions.length}/${settings.reactions_count}` :'Disabled'}>
                            <HiOutlineHeart/>
                        </Buttons.SettingButton>
                    </div>
                    <Caption>
                        Add a channel chat for comments.
                    </Caption>
                    <div className={style.Form}>
                        <Buttons.SettingButton foo={() => setEditModerators({
                            state: true,
                            mounted: true
                        })} text={'Moderators'} desc={settings.moderators.length}>
                            <HiOutlineShieldCheck/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => setEditSubscribers({
                            state: true,
                            mounted: true
                        })} text={'Subscribers'} desc={settings.members.length}>
                            <HiOutlineUsers/>
                        </Buttons.SettingButton>
                        <Buttons.SettingButton foo={() => {
                        }} text={'Removed users'} desc={settings.removed_users.length ? settings.removed_users.length : 'No removed users'}>
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
                {editReactions.mounted &&
                    <EditReactions
                        state={editReactions}
                        setState={setEditReactions}
                        refSidebar={refEditReactions}
                        channelReactions={settings.reactions}
                    />
                }
                {editChannelType.mounted &&
                    <EditType
                        state={editChannelType}
                        setState={setEditChannelType}
                        refSidebar={refEditChannelType}
                        channelType={settings.messenger_setting_type}
                    />
                }
                {editModerators.mounted &&
                    <EditMembers
                        state={editModerators}
                        setState={setEditModerators}
                        refSidebar={refEditModerators}
                        moderators={settings.moderators.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        dropList={ModeratorDropDown}
                    />
                }

                {editSubscribers.mounted &&
                    <EditMembers
                        state={editSubscribers}
                        setState={setEditSubscribers}
                        refSidebar={refEditSubscribers}
                        moderators={settings.members.flatMap(member => member.user)}
                        members={settings.members.flatMap(member => member.user)}
                        dropList={ModeratorDropDown}
                    />
                }
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditMessenger