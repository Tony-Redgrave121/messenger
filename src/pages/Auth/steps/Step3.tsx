import React from 'react'
import {HiOutlineFingerPrint} from "react-icons/hi2"
import style from "../style.module.css"
import InputForm from "@components/inputForm/InputForm"
import {Buttons} from "@components/buttons"
import IStepProps from '../../../types/IStepProps'

const Step3: React.FC<IStepProps> = ({errors, register, handlePrev, handleNext}) => {
    return (
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
                    {...register('user_password', {
                        required: "Password is required",
                        pattern: {
                            value: /^.{8,}$/,
                            message: "Password must be at least 8 characters long"
                        }
                    })}
                />
            </InputForm>
            <div className={style.ButtonBlock}>
                <Buttons.FormButton foo={(event) => handlePrev!(event!, 1)}>PREV</Buttons.FormButton>
                <Buttons.FormButton foo={(event) => handleNext!(event!, 'user_password', 1)}>NEXT</Buttons.FormButton>
            </div>
        </>
    )
}

export default Step3