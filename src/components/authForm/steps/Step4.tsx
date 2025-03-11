import React, {useState} from 'react'
import {HiOutlineUserCircle} from "react-icons/hi2"
import style from "../style.module.css"
import InputForm from "../../inputForm/InputForm"
import Buttons from "../../buttons/Buttons"
import IStepProps from '../../../utils/types/IStepProps'
import {Controller, SubmitHandler} from "react-hook-form";
import IAuthForm from "../../../utils/types/IAuthForm";
import {registration} from "../../../store/reducers/userReducer";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../../utils/hooks/useRedux";
import { Control, UseFormHandleSubmit } from "react-hook-form";

interface IStep4Props extends IStepProps {
    handleSubmit: UseFormHandleSubmit<IAuthForm>,
    control: Control<IAuthForm>,
    setErrorForm: React.Dispatch<React.SetStateAction<string | null>>,
}

const Step4: React.FC<IStep4Props> = ({errors, register, handlePrev, handleSubmit, control, setErrorForm}) => {
    const [picture, setPicture] = useState<File | null>(null)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0])
            onChange(file[0])
        }
    }

    const handleRegistration: SubmitHandler<IAuthForm> = async (data) => {
        const formData = new FormData()

        formData.append('user_image', data.user_image as File)
        formData.append('user_name', data.user_name)
        formData.append('user_email', data.user_email)
        formData.append('user_password', data.user_password)
        formData.append('user_bio', data.user_bio)

        const res = await dispatch(registration({formData: formData})) as any

        if (res.payload.message) setErrorForm(res.payload.message)
        else return navigate('/')
    }

    return (
        <>
            <div className={style.FileBlock}>
                <Controller
                    control={control}
                    name="user_image"
                    render={({field: {onChange}}) => <input type="file" accept="image/png, image/jpeg" id='user_image' onChange={(event) => handleImageChange(event.currentTarget.files, onChange)}/>}
                />
                <label htmlFor="user_image">
                    {picture ?
                        <img src={URL.createObjectURL(picture)} alt="profile"/> : <HiOutlineUserCircle/>
                    }
                </label>
            </div>
            <div className={style.TitleBlock}>
                <h1>Create Your Profile</h1>
                <p>Please enter the data to create your profile.</p>
            </div>
            <InputForm errors={errors} field="user_name">
                <input
                    type="text"
                    id="user_name"
                    placeholder="Name"
                    {...register('user_name', {
                        required: 'User name is required'
                    })}
                />
            </InputForm>
            <InputForm errors={errors} field="user_bio">
                <textarea rows={4} placeholder="Bio" {...register('user_bio')}></textarea>
            </InputForm>
            <div className={style.ButtonBlock}>
                <Buttons.FormButton foo={(event) => handlePrev!(event!,2)}>PREV</Buttons.FormButton>
                <Buttons.FormButton foo={handleSubmit(handleRegistration)}>REGISTER</Buttons.FormButton>
            </div>
        </>
    )
}

export default Step4