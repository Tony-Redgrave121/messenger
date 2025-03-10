import React from 'react'
import {HiOutlineEnvelope} from "react-icons/hi2"
import style from "../style.module.css"
import InputForm from "../inputForm/InputForm"
import Buttons from "../../buttons/Buttons"
import IStepProps from '../../../utils/types/IStepProps'
import {UseFormTrigger, UseFormWatch} from "react-hook-form";
import IAuthForm from "../../../utils/types/IAuthForm";
import AuthService from "../../../service/AuthService";

interface IStep2Props extends IStepProps {
    watch: UseFormWatch<IAuthForm>,
    trigger: UseFormTrigger<IAuthForm>
}

const Step2: React.FC<IStep2Props> = ({errors, register, watch, handlePrev, handleNext, trigger}) => {
    const handleConfirmation = async () => {
        try {
            const isValid = await trigger('user_code')
            const code = watch('user_code')

            if (isValid && code) {
                await AuthService.confirmEmail(code)
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
            <InputForm errors={errors} field="user_code">
                <input
                    type="number"
                    id="user_code"
                    placeholder="Code"
                    {...register('user_code', {
                        required: "Code is required",
                        pattern: {
                            value: /^.{6,}$/,
                            message: "Code must be at least 6 numbers long"
                        }
                    })}
                />
            </InputForm>
            <div className={style.ButtonBlock}>
                <Buttons.FormButton foo={(event) => handlePrev!(event!, 1)}>PREV</Buttons.FormButton>
                <Buttons.FormButton foo={(event) => handleNext!(event!, 'user_code', 1)}>NEXT</Buttons.FormButton>
            </div>
        </>
    )
}

export default Step2