import React, {useRef, useState} from 'react'
import style from './style.module.css'
import InputForm from "./inputForm/InputForm";
import Buttons from "../buttons/Buttons";
import {Controller, useForm} from "react-hook-form";
import IAuthForm from "../../utils/types/IAuthForm";
import {login, registration} from "../../store/reducers/userReducer";
import {useNavigate} from 'react-router-dom'
import {useAppDispatch} from "../../utils/hooks/useRedux";
import {CSSTransition} from "react-transition-group"
import './animation.css'
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineFingerPrint,
    HiOutlineUserCircle
} from "react-icons/hi2";

const AuthForm = () => {
    const [errorForm, setErrorForm] = useState<string | null>()
    const [formNumber, setFormNumber] = useState(0)
    const [formState, setFormState] = useState(true)
    const [picture, setPicture] = useState<File | null>(null)
    const refForm = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const {register,
        handleSubmit,
        formState: {errors},
        trigger,
        watch,
        control} = useForm({
        defaultValues: {
            user_email: '',
            user_code: undefined,
            user_password: '',
            user_image: null,
            user_name: '',
            user_bio: '',
        }
    })

    const registerOptions = {
        user_name: {required: "Name is required"},
        user_email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
            }
        },
        user_password: {
            required: "Password is required",
            pattern: {
                value: /^.{8,}$/,
                message: "Password must be at least 8 characters long"
            }
        },
        user_code: {
            required: "Code is required",
            pattern: {
                value: /^.{6,}$/,
                message: "Code must be at least 6 numbers long"
            }
        }
    }

    const handleRegistration = async (data: IAuthForm) => {
        console.log('reg')
        const formData = new FormData()
        formData.append('user_image', data.user_image as File)
        formData.append('user_name', data.user_name)
        formData.append('user_email', data.user_email)
        formData.append('user_password', data.user_password)
        formData.append('user_bio', data.user_bio)

        const res = await dispatch(registration({formData: formData})) as any

        console.log(res)

        if (res.payload.message) setErrorForm(res.payload.message)
        else return navigate('/')
    }

    const handlePrev = (num: number) => {
        setFormState(false)
        setTimeout(() => {
            setFormNumber(prev => prev - num)
            setFormState(true)
        }, 300)
    }

    const handleNext = async (name: "user_code" | "user_image" | "user_name" | "user_bio" | "user_email" | "user_password", num: number) => {
        const isValid = await trigger([name])
        if (isValid) {
            if (name === 'user_password') {
                const formData = new FormData()
                formData.append('user_email', watch('user_email'))
                formData.append('user_password', watch('user_password'))

                const res = await dispatch(login({formData: formData})) as any
                if (res.payload.message) setErrorForm(res.payload.message)
                else return navigate('/')
            }

            setFormState(false)
            setTimeout(() => {
                setFormNumber(prev => prev + num)
                setFormState(true)
            }, 300)
        }

        return true
    }

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0])
            onChange(file[0])
        }
    }

    const steps = [
        {
            id: 0,
            component: (
                <>
                    <HiOutlineChatBubbleLeftRight/>
                    <div className={style.TitleBlock}>
                        <h1>Auth in to Messenger</h1>
                        <p>Please enter your email address.</p>
                    </div>
                    <InputForm errors={errors} field={"user_email"}>
                        <input type='email' id="user_email" placeholder="Email Adress" {...register('user_email', registerOptions.user_email)}></input>
                    </InputForm>
                    <Buttons.FormButton foo={() => handleNext('user_email', 1)}>NEXT</Buttons.FormButton>
                </>
            ),
        },
        // {
        //     id: 1,
        //     component: (
        //         <>
        //             <HiOutlineEnvelope/>
        //             <div className={style.TitleBlock}>
        //                 <h1>{watch('user_email')}</h1>
        //                 <p>We have sent you a message in Email with the code.</p>
        //             </div>
        //             <InputForm errors={errors} field="user_code">
        //                 <input
        //                     type="number"
        //                     id="user_code"
        //                     placeholder="Code"
        //                     {...register('user_code', registerOptions.user_code)}
        //                 />
        //             </InputForm>
        //             <div className={style.ButtonBlock}>
        //                 <Buttons.FormButton foo={() => handlePrev(1)}>PREV</Buttons.FormButton>
        //                 <Buttons.FormButton foo={() => handleNext('user_code', 1)}>NEXT</Buttons.FormButton>
        //             </div>
        //         </>
        //     ),
        // },
        {
            id: 1,
            component: (
                <>
                    <HiOutlineFingerPrint/>
                    <div className={style.TitleBlock}>
                        <h1>Enter Your Password</h1>
                        <p>Your account is protected with an additional password.</p>
                    </div>
                    <InputForm errors={errors} field="user_password">
                        <input
                            type="password"
                            id="user_password"
                            placeholder="Password"
                            {...register('user_password', registerOptions.user_password)}
                        />
                    </InputForm>
                    <div className={style.ButtonBlock}>
                        <Buttons.FormButton foo={() => handlePrev(2)}>PREV</Buttons.FormButton>
                        <Buttons.FormButton foo={() => handleNext('user_password', 1)}>NEXT</Buttons.FormButton>
                    </div>
                </>
            ),
        },
        {
            id: 2,
            component: (
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
                            {...register('user_name', registerOptions.user_name)}
                        />
                    </InputForm>
                    <InputForm errors={errors} field="user_bio">
                        <textarea rows={4} placeholder="Bio" {...register('user_bio')}></textarea>
                    </InputForm>
                    <div className={style.ButtonBlock}>
                        <Buttons.FormButton foo={() => handlePrev(2)}>PREV</Buttons.FormButton>
                        <Buttons.FormButton foo={handleSubmit(handleRegistration)}>REGISTER</Buttons.FormButton>
                    </div>
                </>
            ),
        },
    ]

    return (
        <div onSubmit={handleSubmit(handleRegistration)} className={style.AuthContainer}>
            <form noValidate className={style.AuthForm}>
                <CSSTransition
                    in={formState}
                    nodeRef={refForm}
                    timeout={300}
                    classNames='form-node'
                    unmountOnExit
                >
                    <div ref={refForm}>
                        {steps[formNumber].component}
                        {errorForm && <small>{errorForm}</small>}
                    </div>
                </CSSTransition>
            </form>
        </div>
    )
}

export default AuthForm