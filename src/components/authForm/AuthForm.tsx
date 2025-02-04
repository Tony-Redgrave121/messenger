import React, {useEffect, useState} from 'react'
import style from './style.module.css'
import logo from '../../utils/logo/logo500.png'
import InputForm from "./inputForm/InputForm";
import Buttons from "../buttons/Buttons";
import {useForm} from "react-hook-form";
import IAuthForm from "../../utils/types/IAuthForm";
import {registration} from "../../store/reducers/userReducer";
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from "../../utils/hooks/useRedux";

const AuthForm = () => {
    const [errorForm, setErrorForm] = useState<string | null>()
    const [formNumber, setFormNumber] = useState(0)
    const dispatch = useAppDispatch()

    const {register, handleSubmit, formState: { errors }} = useForm({
        defaultValues: {
            user_email: '',
            user_password: '',
            user_password_confirm: '',
            user_image: null,
            user_name: '',
            user_bio: '',
        }
    })

    const registerOptions = {
        user_name: { required: "Name is required" },
        user_email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
            }},
        user_password: {
            required: "Password is required",
            pattern: {
                value: /^.{8,}$/,
                message: "Password must be at least 8 characters long"
            }
        }
    }

    const handleRegistration = async (data: IAuthForm) => {
        const formData = new FormData()
        formData.append('user_image', data.user_image as File)
        formData.append('user_name', data.user_name)
        formData.append('user_email', data.user_email)
        formData.append('user_password', data.user_password)

        const res = await dispatch(registration({formData: formData})) as any

        if (res.payload.message) setErrorForm(res.payload.message)
        else return <Navigate to='/'/>
    }

    useEffect(() => {
        console.log(register)
    }, [register])

    const steps = [
        {
            id: 0,
            component: (
                <>
                    <img src={logo} alt="Logo"/>
                    <div className={style.TitleBlock}>
                        <h1>Auth in to Messenger</h1>
                        <p>Please enter your email address.</p>
                    </div>
                    <InputForm errors={errors} field={"user_email"}>
                        <input type='email' id="user_email" placeholder="Email Adress" {...register('user_email', registerOptions.user_email)}></input>
                    </InputForm>
                </>
            ),
        },
        {
            id: 1,
            component: (
                <InputForm errors={errors} field="user_password">
                    <input
                        type="password"
                        id="user_password"
                        placeholder="Password"
                        {...register('user_password', registerOptions.user_password)}
                    />
                </InputForm>
            ),
        },
        {
            id: 2,
            component: (
                <InputForm errors={errors} field="user_name">
                    <input
                        type="text"
                        id="user_name"
                        placeholder="Your Name"
                        {...register('user_name', registerOptions.user_name)}
                    />
                </InputForm>
            ),
        },
    ]

    return (
        <div className={style.AuthContainer}>
            <form onSubmit={handleSubmit(handleRegistration)} noValidate className={style.AuthForm}>
                {steps[formNumber].component}
                <Buttons.FormButton foo={() => setFormNumber(prev => prev + 1)}>NEXT</Buttons.FormButton>
                {formNumber === steps.length && <Buttons.FormButton type="submit">REGISTER</Buttons.FormButton>}
            </form>
        </div>
    )
}

export default AuthForm