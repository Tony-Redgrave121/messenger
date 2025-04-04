import React, {Dispatch, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import SidebarContainer from "../../SidebarContainer";
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "./style.module.css";
import styleSidebar from "../style.module.css";
import Buttons from "../../../buttons/Buttons";
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlinePhoto
} from "react-icons/hi2";
import InputForm from "../../../inputForm/InputForm";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import IMessenger from "../../../../utils/types/IMessenger";
import AddContacts from "../../../contacts/AddContacts/AddContacts";
import IContact from "../../../../utils/types/IContact";
import messengerService from "../../../../service/MessengerService"
import {useAppDispatch, useAppSelector} from "../../../../utils/hooks/useRedux";
import {setMessengersList} from "../../../../store/reducers/appReducer";
import useGetContacts from "../../../../utils/hooks/useGetContacts"
import SearchBlock from "../../../searchBlock/SearchBlock";
import ContactList from "../../../contactList/ContactList";
import useSearch from "../../../../utils/hooks/useSearch";

interface IMessengerProps {
    messengerCreation: {
        state: boolean,
        type: string
    },
    setMessengerCreation: Dispatch<SetStateAction<{
        state: boolean,
        type: string
    }>>,
    socketRef: RefObject<WebSocket | null>
}

const InitialValues: IMessenger = {
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
    messenger_type: '',
    messenger_members: [],
}

const Messenger: React.FC<IMessengerProps> = ({messengerCreation, setMessengerCreation, socketRef}) => {
    const [errorForm, setErrorForm] = useState<string | null>(null)
    const [members, setMembers] = useState<IContact[]>([])
    const [picture, setPicture] = useState<File | null>(null)
    const [animationState, setAnimationState] = useState(false)
    const {contacts} = useGetContacts()
    const {filteredContacts, handleInput} = useSearch(contacts)

    const refSidebar = useRef(null)
    const refForm = useRef(null)
    const navigate = useNavigate()
    const userId = useAppSelector(state => state.user.userId)
    const searchRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

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

    const {
        register,
        handleSubmit,
        formState: {errors},
        control
    } = useForm({defaultValues: InitialValues})

    const fieldOptions = {
        messenger_name: {
            required: `${messengerCreation.type} name is required`
        }
    }

    const handleCreation: SubmitHandler<IMessenger> = async (data) => {
        const formData = new FormData()

        formData.append('user_id', userId)
        formData.append('messenger_name', data.messenger_name)
        formData.append('messenger_image', data.messenger_image as File)
        formData.append('messenger_desc', data.messenger_desc)
        formData.append('messenger_type', messengerCreation.type)

        if (members) members.map(member => formData.append('messenger_members', member.user_id))
        const res = await messengerService.postMessenger(formData) as any

        if (res.data.message) setErrorForm(res.data.message)
        else {
            navigate('/')

            if (res.data && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    user_id: userId,
                    method: 'GET_MESSENGERS',
                    data: res.data
                }))
            }

            setAnimationState(false)
            dispatch(setMessengersList(res.data))

            return setMessengerCreation(prev => ({
                ...prev,
                state: false,
            }))
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
            <SidebarContainer styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <div className={style.TopBar}>
                    <Buttons.DefaultButton foo={() => setMessengerCreation(prev => ({
                        ...prev,
                        state: false,
                    }))}>
                        <HiOutlineArrowLeft/>
                    </Buttons.DefaultButton>
                    <h1>New {messengerCreation.type}</h1>
                </div>
                {messengerCreation.type !== "chat" ?
                    <form noValidate className={style.MessengerForm} ref={refForm}>
                        <div className={style.FileBlock}>
                            <Controller
                                control={control}
                                name="messenger_image"
                                render={({field: {onChange}}) => (
                                    <input type="file" accept="image/png, image/jpeg" id='messenger_img' onChange={(event) => handleImageChange(event.currentTarget.files, onChange)}/>
                                )}
                            />
                            <label htmlFor="messenger_img">
                                {picture ?
                                    <img src={URL.createObjectURL(picture)} alt={messengerCreation.type}/> :
                                    <div><HiOutlinePhoto/></div>
                                }
                            </label>
                        </div>
                        <InputForm errors={errors} field={"messenger_name"}>
                            <input type='text' id="messenger_name" placeholder={`${messengerCreation.type} name`} {...register('messenger_name', fieldOptions.messenger_name)}></input>
                        </InputForm>
                        {messengerCreation.type === "channel" &&
                            <InputForm errors={errors} field={"messenger_desc"}>
                                <input type='text' id="messenger_desc" placeholder="Description (optional)" {...register('messenger_desc')}></input>
                            </InputForm>
                        }
                        {(members && contacts.length > 0) &&
                            <AddContacts members={members} contacts={contacts} setMembers={setMembers}/>}
                        {messengerCreation.type === "channel" &&
                            <p>You can provide an optional description for your channel.</p>
                        }
                        {errorForm && <small>{errorForm}</small>}
                    </form>
                    :
                    <>
                        <SearchBlock foo={handleInput} ref={searchRef}/>
                        {filteredContacts.length > 0 && <ContactList contacts={filteredContacts}/>}
                    </>
                }
                {messengerCreation.type !== "chat" &&
                    <span className={styleSidebar.CreateButton}>
                        <Buttons.InterButton foo={handleSubmit(handleCreation)}>
                            <HiOutlineArrowRight/>
                        </Buttons.InterButton>
                    </span>
                }
            </SidebarContainer>
        </CSSTransition>
    )
}

export default Messenger