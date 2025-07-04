import React, {FC} from 'react'
import {HiOutlineFingerPrint} from "react-icons/hi2"
import style from "../AuthForm/auth-form.module.css"
import {FormButton} from "@shared/ui/Button";
import {FormInput} from "@shared/ui/Input";
import AuthStepSchema from "../../model/types/AuthStepSchema";

const Step3: FC<AuthStepSchema> = (
    {
        errors,
        register,
        handlePrev,
        handleNext
    }
) => {
    return (
        <>
            <HiOutlineFingerPrint/>
            <div className={style.TitleBlock}>
                <h1>Enter Your Password</h1>
                <p>Your account is protected with an additional password.</p>
            </div>
            <FormInput errors={errors} field="user_password">
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
            </FormInput>
            <div className={style.ButtonBlock}>
                <FormButton foo={(event) => {
                    handlePrev!(event!, 1)
                }}>
                    PREV
                </FormButton>
                <FormButton foo={(event) => {
                    handleNext!(event!, 'user_password', 1)
                }}>
                    NEXT
                </FormButton>
            </div>
        </>
    )
}

export default Step3