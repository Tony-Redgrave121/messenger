import React from 'react'
import {HiOutlineEnvelope} from "react-icons/hi2"
import style from "../style.module.css"
import {UseFormTrigger, UseFormWatch} from "react-hook-form";
import {IAuthForm, IStepProps} from "@appTypes";
import AuthService from "../../../services/AuthService";
import {FormButton} from "@shared/ui/Button";
import {FormInput} from "@shared/ui/Input";

interface IStep2Props extends IStepProps {
    watch: UseFormWatch<IAuthForm>,
    trigger: UseFormTrigger<IAuthForm>
    setErrorForm: React.Dispatch<React.SetStateAction<string | null>>,
}

const Step2: React.FC<IStep2Props> = ({errors, register, watch, handlePrev, handleNext, trigger, setErrorForm}) => {
    const handleConfirmation = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        try {
            const isValid = await trigger('user_code')
            const [user_code, user_email] = watch(['user_code', 'user_email'])

            if (isValid && user_code) {
                const res = await AuthService.confirmEmail(user_code, user_email)
                const message = res.data.message

                if (!message) {
                    setErrorForm('')
                    handleNext!(event, 'user_code', 1)
                }
                else setErrorForm(message)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <HiOutlineEnvelope/>
            <div className={style.TitleBlock}>
                <h1>{watch(['user_email'])}</h1>
                <p>We have sent you a message in Email with the code.</p>
            </div>
            <FormInput errors={errors} field="user_code">
                <input
                    type="number"
                    id="user_code"
                    placeholder="Code"
                    max="999999"
                    {...register('user_code', {
                        required: "Code is required",
                        pattern: {
                            value: /^.{6,}$/,
                            message: "Code must be at least 6 numbers long"
                        }
                    })}
                />
            </FormInput>
            <div className={style.ButtonBlock}>
                <FormButton foo={(event) => handlePrev!(event!, 1)}>PREV</FormButton>
                <FormButton foo={(event) => handleConfirmation(event!)}>NEXT</FormButton>
            </div>
        </>
    )
}

export default Step2