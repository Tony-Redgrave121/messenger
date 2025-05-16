import React, {useRef, useState} from 'react'
import style from './style.module.css'
import {useForm} from "react-hook-form";
import {login} from "@store/reducers/userReducer";
import {useNavigate} from 'react-router-dom'
import {useAppDispatch} from "@hooks/useRedux";
import {CSSTransition} from "react-transition-group"
import './animation.css'
import {Step1, Step2, Step3, Step4} from "./";
import {IAuthForm} from "@appTypes";
import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";
import PopupMessage from "@components/popup/popupMessage/PopupMessage";

const InitialValues: IAuthForm = {
    user_email: '',
    user_code: undefined,
    user_password: '',
    user_image: null,
    user_name: '',
    user_bio: '',
}

const AuthForm = () => {
    const [errorForm, setErrorForm] = useState<string | null>(null)
    const [formNumber, setFormNumber] = useState(0)
    const [formState, setFormState] = useState(true)
    const refForm = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: {errors},
        trigger,
        watch,
        control
    } = useForm({defaultValues: InitialValues})

    const handlePrev = (event: React.MouseEvent<any>, num: number) => {
        event.preventDefault()

        setFormState(false)
        setTimeout(() => {
            setFormNumber(prev => prev - num)
            setFormState(true)
        }, 300)
    }

    const handleNext = async (event: React.MouseEvent<any>, name: "user_code" | "user_image" | "user_name" | "user_bio" | "user_email" | "user_password", num: number) => {
        event.preventDefault()
        const isValid = await trigger(name)

        if (isValid) {
            if (name === 'user_password') {
                const formData = new FormData()
                formData.append('user_email', watch('user_email'))
                formData.append('user_password', watch('user_password'))

                const res = await dispatch(login({formData: formData})) as any
                const payload = res.payload

                if (payload.message) {
                    dispatch(setPopupMessageState(true))
                    return dispatch(setPopupMessageChildren(payload.message))
                }
                else if (!payload.registration) return navigate('/')
            }

            setFormState(false)
            setTimeout(() => {
                setFormNumber(prev => prev + num)
                setFormState(true)
            }, 300)
        }
    }

    const steps = [
        {
            id: 1,
            component: <Step1 register={register} handleNext={handleNext} errors={errors} trigger={trigger} watch={watch}/>
        },
        {
            id: 2,
            component: <Step2 register={register} handleNext={handleNext} errors={errors} watch={watch} handlePrev={handlePrev} trigger={trigger} setErrorForm={setErrorForm}/>
        },
        {
            id: 3,
            component: <Step3 register={register} handleNext={handleNext} errors={errors} handlePrev={handlePrev}/>
        },
        {
            id: 4,
            component: <Step4 register={register} errors={errors} setErrorForm={setErrorForm} handleSubmit={handleSubmit} handlePrev={handlePrev} control={control}/>
        }
    ]

    return (
        <div className={style.AuthContainer}>
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
                    </div>
                </CSSTransition>
            </form>
            <PopupMessage/>
        </div>
    )
}

export default AuthForm