import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group";
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css'
import style from "./style.module.css";
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlinePhoto,
} from "react-icons/hi2";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@shared/lib";
import {addMessenger} from "@entities/Messenger/model/slice/messengerSlice";
import {SearchBar} from "@shared/ui/SearchBar"
import {useSearch}from "@shared/lib";
import {useAbortController} from "@shared/lib";
import useCloseLeftSidebar from "@widgets/LeftSidebar/lib/hooks/useCloseLeftSidebar";
import {CreateButton, DefaultButton} from "@shared/ui/Button";
import {FormInput} from "@shared/ui/Input";
import {Sidebar} from "@shared/ui/Sidebar";
import {ContactSchema} from "@entities/Contact";
import {AddContact} from "../../AddContact";
import {ContactList} from "../../ContactList";
import postMessengerApi from "../api/postMessengerApi";
import NewMessengerSchema from "@features/CreateMessenger/model/types/NewMessengerSchema";

interface IMessengerProps {
    messengerCreation: {
        state: boolean,
        type: string
    },
    setMessengerCreation: Dispatch<SetStateAction<{
        state: boolean,
        type: string
    }>>,
    socketRef: WebSocket | null
}

const InitialValues: NewMessengerSchema = {
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
    messenger_type: '',
    messenger_members: [],
}

const CreateMessenger: FC<IMessengerProps> = ({messengerCreation, setMessengerCreation, socketRef}) => {
    const [errorForm, setErrorForm] = useState<string | null>(null)
    const [members, setMembers] = useState<ContactSchema[]>([])
    const [picture, setPicture] = useState<File | null>(null)
    const [animationState, setAnimationState] = useState(false)
    const contacts = useAppSelector(state => state.contact.contacts)

    const {filteredArr, handleInput} = useSearch(contacts, 'user_name')

    const refSidebar = useRef(null)
    const refForm = useRef(null)
    const navigate = useNavigate()
    const userId = useAppSelector(state => state.user.userId)
    const searchRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const {getSignal} = useAbortController()

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        if (!messengerCreation.state) {
            timer = setTimeout(() => setMessengerCreation(prev => ({
                ...prev,
                type: ''
            })), 300)
        }

        setAnimationState(messengerCreation.state)

        return () => {
            timer && clearTimeout(timer)
        }
    }, [messengerCreation.state, setMessengerCreation])

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0])
            onChange(file[0])
        }
    }

    const {closeSidebar} = useCloseLeftSidebar()
    const navigateChat = (user_id: string) => {
        setAnimationState(false)
        closeSidebar()

        return navigate(`/chat/${user_id}`)
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        watch
    } = useForm({defaultValues: InitialValues})

    const fieldOptions = {
        messenger_name: {
            required: `${messengerCreation.type} name is required`
        }
    }

    const handleCreation: SubmitHandler<NewMessengerSchema> = async (data) => {
        try {
            const formData = new FormData()
            formData.append('user_id', userId)
            formData.append('messenger_name', data.messenger_name)
            formData.append('messenger_image', data.messenger_image as File)
            formData.append('messenger_desc', data.messenger_desc)
            formData.append('messenger_type', messengerCreation.type)

            if (members) members.map(member => formData.append('messenger_members', member.user_id))

            const signal = getSignal()
            const newMessenger = await postMessengerApi(formData, signal)

            if (newMessenger.status === 200) {
                const newMessengerData = newMessenger.data

                if (members) {
                    if (newMessengerData && socketRef?.readyState === WebSocket.OPEN) {
                        socketRef.send(JSON.stringify({
                            user_id: userId,
                            method: 'JOIN_TO_MESSENGER',
                            data: newMessengerData
                        }))
                    }
                }

                dispatch(addMessenger({
                    messenger_id: newMessengerData.messenger_id,
                    messenger_name: newMessengerData.messenger_name,
                    messenger_image: newMessengerData.messenger_image,
                    messenger_type: newMessengerData.messenger_type,
                    messages: []
                }))

                setAnimationState(false)
                navigate('/')

                return setMessengerCreation(prev => ({
                    ...prev,
                    state: false,
                }))
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <CSSTransition
            in={animationState}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <div className={style.TopBar}>
                    <DefaultButton foo={() => setMessengerCreation(prev => ({
                        ...prev,
                        state: false,
                    }))}>
                        <HiOutlineArrowLeft/>
                    </DefaultButton>
                    <h1>New {messengerCreation.type}</h1>
                </div>
                {messengerCreation.type !== "chat" ?
                    <form noValidate className={style.MessengerForm} ref={refForm}>
                        <div className={style.FileBlock}>
                            <Controller
                                control={control}
                                name="messenger_image"
                                render={({field: {onChange}}) => (
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        id='messenger_img'
                                        onChange={(event) => handleImageChange(event.currentTarget.files, onChange)}
                                    />
                                )}
                            />
                            <label htmlFor="messenger_img">
                                {picture ?
                                    <img src={URL.createObjectURL(picture)} alt={messengerCreation.type}/> :
                                    <div><HiOutlinePhoto/></div>
                                }
                            </label>
                        </div>
                        <FormInput errors={errors} field={"messenger_name"}>
                            <input
                                type="text"
                                id="messenger_name"
                                placeholder={`${messengerCreation.type} name`}
                                {...register('messenger_name', fieldOptions.messenger_name)}
                            />
                        </FormInput>
                        {messengerCreation.type === "channel" &&
                            <FormInput errors={errors} field={"messenger_desc"}>
                                <input
                                    type="text"
                                    id="messenger_desc"
                                    placeholder="Description (optional)"
                                    {...register('messenger_desc')}
                                />
                            </FormInput>
                        }
                        {(members && contacts.length > 0) &&
                            <AddContact members={members} setMembers={setMembers}/>
                        }
                        {errorForm && <small>{errorForm}</small>}
                    </form>
                    :
                    <>
                        <SearchBar foo={handleInput} searchRef={searchRef}/>
                        <ContactList contacts={filteredArr} text='Contacts' onClick={navigateChat}/>
                    </>
                }
                {messengerCreation.type === "channel" &&
                    <p>You can provide an optional description for your channel.</p>
                }
                <CreateButton
                    state={messengerCreation.type !== "chat" && watch('messenger_name') !== ''}
                    foo={handleSubmit(handleCreation)}
                >
                    <HiOutlineArrowRight/>
                </CreateButton>
            </Sidebar>
        </CSSTransition>
    )
}

export default CreateMessenger