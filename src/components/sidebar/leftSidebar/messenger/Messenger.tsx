import React, {useRef, useState} from 'react'
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
import Contacts from "../../../contacts/Contacts";
import SearchBlock from "../../../searchBlock/SearchBlock";

interface IMessengerProps {
    messengerCreation: {
        state: boolean,
        type: string
    },
    setMessengerCreation: React.Dispatch<React.SetStateAction<{
        state: boolean,
        type: string
    }>>
}

const InitialValues: IMessenger = {
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
    messenger_type: '',
    messenger_members: [],
}

const ContactsList = [
    {
        contact_id: '1',
        contact_name: 'Володя',
        contact_image: '',
        contact_last_seen: new Date(),
    },
    {
        contact_id: '2',
        contact_name: 'Duna',
        contact_image: '',
        contact_last_seen: new Date(),
    },
]

const Messenger: React.FC<IMessengerProps> = ({messengerCreation, setMessengerCreation}) => {
    const [errorForm, setErrorForm] = useState<string | null>(null)
    const [picture, setPicture] = useState<File | null>(null)

    const refSidebar = useRef(null)
    const refForm = useRef(null)
    const refSearchBlock = useRef(null)
    const navigate = useNavigate()

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

    const fieldOptions = {
        messenger_name: {
            required: "Email is required"
        }
    }

    const handleCreation: SubmitHandler<IMessenger> = async (data) => {
        const formData = new FormData()

        formData.append('messenger_name', data.messenger_name)
        formData.append('messenger_image', data.messenger_image as File)
        formData.append('messenger_desc', data.messenger_desc)
        formData.append('messenger_type', data.messenger_type)
        formData.append('messenger_members', JSON.stringify(data.messenger_members))

        // const res = await
        //
        // if (res.payload.message) setErrorForm(res.payload.message)
        // else return navigate('/')
    }

    return (
        <CSSTransition
            in={messengerCreation.state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']} ref={refSidebar}>
                <div className={style.TopBar}>
                    <Buttons.DefaultButton foo={() => setMessengerCreation({
                        type: '',
                        state: false,
                    })}>
                        <HiOutlineArrowLeft/>
                    </Buttons.DefaultButton>
                    <h1>New Channel</h1>
                </div>
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
                    <InputForm errors={errors} field={"user_email"}>
                        <input type='text' id="messenger_name" placeholder="Channel name" {...register('messenger_name', fieldOptions.messenger_name)}></input>
                    </InputForm>
                    <InputForm errors={errors} field={"user_email"}>
                        <input type='text' id="messenger_desc" placeholder="Description (optional)" {...register('messenger_desc')}></input>
                    </InputForm>
                    <div className={style.ContactsContainer}>
                        <SearchBlock ref={refSearchBlock}/>
                        {ContactsList.map((contact) => <Contacts contact={contact} key={contact.contact_id}/>)}
                    </div>
                    <p>You can provide an optional description for your channel.</p>
                    {errorForm && <small>{errorForm}</small>}
                </form>
                <span className={styleSidebar.CreateButton}>
                    <Buttons.InterButton foo={() => handleSubmit(handleCreation)}>
                        <HiOutlineArrowRight/>
                    </Buttons.InterButton>
                </span>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default Messenger