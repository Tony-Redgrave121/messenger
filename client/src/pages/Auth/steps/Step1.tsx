import {FC} from 'react'
import {HiOutlineChatBubbleLeftRight} from "react-icons/hi2"
import style from "../style.module.css"
import {IStepProps, IAuthForm} from '@appTypes'
import AuthService from '../../../services/AuthService'
import {UseFormTrigger, UseFormWatch} from "react-hook-form";
import {FormButton} from "@shared/ui/Button";
import {FormInput} from "@shared/ui/Input";

interface IStep3Props extends IStepProps {
    watch: UseFormWatch<IAuthForm>,
    trigger: UseFormTrigger<IAuthForm>
}

const Step1: FC<IStep3Props> = ({errors, register, handleNext, watch, trigger}) => {
    const handleCode = async () => {
        try {
            const isValid = await trigger('user_email')

            if (isValid) {
                const email = watch('user_email')
                await AuthService.sendCode(email)
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
            <FormInput errors={errors} field={"user_email"}>
                <input type='email' id="user_email" placeholder="Email Adress" {...register('user_email', {
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })}></input>
            </FormInput>
            <FormButton foo={(event) => {
                handleCode()
                handleNext!(event!, 'user_email', 1)
            }}>NEXT</FormButton>
        </>
    )
}

export default Step1