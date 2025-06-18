import {FC} from 'react'
import {HiOutlineChatBubbleLeftRight} from "react-icons/hi2"
import style from "../style.module.css"
import {InputForm} from "@components/inputForm"
import {Buttons} from "@components/buttons"
import {IStepProps, IAuthForm} from '@appTypes'
import AuthService from '../../../service/AuthService'
import {UseFormTrigger, UseFormWatch} from "react-hook-form";
import {useAbortController} from "@hooks/useAbortController";

interface IStep3Props extends IStepProps {
    watch: UseFormWatch<IAuthForm>,
    trigger: UseFormTrigger<IAuthForm>
}

const Step1: FC<IStep3Props> = ({errors, register, handleNext, watch, trigger}) => {
    const {getSignal} = useAbortController()

    const handleCode = async () => {
        try {
            const isValid = await trigger('user_email')

            if (isValid) {
                const email = watch('user_email')
                const signal = getSignal()
                await AuthService.sendCode(email, signal)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <HiOutlineChatBubbleLeftRight/>
            <div className={style.TitleBlock}>
                <h1>Auth in to Messenger</h1>
                <p>Please enter your email address.</p>
            </div>
            <InputForm errors={errors} field={"user_email"}>
                <input type='email' id="user_email" placeholder="Email Adress" {...register('user_email', {
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })}></input>
            </InputForm>
            <Buttons.FormButton foo={(event) => {
                handleCode()
                handleNext!(event!, 'user_email', 1)
            }}>NEXT</Buttons.FormButton>
        </>
    )
}

export default Step1