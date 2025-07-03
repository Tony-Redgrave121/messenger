import React, {useState} from 'react'
import style from "../style.module.css"
import {IStepProps, IAuthForm} from '@appTypes'
import { SubmitHandler} from "react-hook-form";
import {registration} from "@entities/User/lib/thunk/userThunk";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "@shared/lib";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import {FormButton} from "@shared/ui/Button";
import {FileInput, FormInput} from "@shared/ui/Input";

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
        try {
            const formData = new FormData()

            formData.append('user_img', data.user_image as File)
            formData.append('user_name', data.user_name)
            formData.append('user_email', data.user_email)
            formData.append('user_password', data.user_password)
            formData.append('user_bio', data.user_bio)

            await dispatch(registration({formData: formData}))

            return navigate('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <FileInput name="user_image" control={control} handleImageChange={handleImageChange} picture={picture}/>
            <div className={style.TitleBlock}>
                <h1>Create Your Profile</h1>
                <p>Please enter the data to create your profile.</p>
            </div>
            <FormInput errors={errors} field="user_name">
                <input
                    type="text"
                    id="user_name"
                    placeholder="Name"
                    {...register('user_name', {
                        required: 'User name is required'
                    })}
                />
            </FormInput>
            <FormInput errors={errors} field="user_bio">
                <textarea rows={4} placeholder="Bio" {...register('user_bio')}></textarea>
            </FormInput>
            <div className={style.ButtonBlock}>
                <FormButton foo={(event) => handlePrev!(event!,2)}>PREV</FormButton>
                <FormButton foo={handleSubmit(handleRegistration)}>REGISTER</FormButton>
            </div>
        </>
    )
}

export default Step4