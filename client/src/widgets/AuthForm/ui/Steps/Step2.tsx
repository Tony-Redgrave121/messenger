import React, { FC } from 'react';
import { UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { HiOutlineEnvelope } from 'react-icons/hi2';
import confirmEmailApi from '@widgets/AuthForm/api/confirmEmailApi';
import AuthFormSchema from '@widgets/AuthForm/model/types/AuthFormSchema';
import AuthStepSchema from '@widgets/AuthForm/model/types/AuthStepSchema';
import { setPopupChildren, setPopupState } from '@entities/Message';
import { useAppDispatch } from '@shared/lib';
import { FormButton, FormInput } from '@shared/ui';
import style from './step.module.css';

interface IStep2Props extends AuthStepSchema {
    watch: UseFormWatch<AuthFormSchema>;
    trigger: UseFormTrigger<AuthFormSchema>;
}

const Step2: FC<IStep2Props> = ({ errors, register, watch, handleStep, trigger }) => {
    const dispatch = useAppDispatch();

    const handleConfirmation = async (event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const isValid = await trigger('user_code');
            const [user_code, user_email] = watch(['user_code', 'user_email']);

            if (!isValid || !user_code) return;

            const res = await confirmEmailApi(user_code, user_email);
            const message = res.data.message;

            if (!message) return handleStep(event, 2);

            dispatch(setPopupState(true));
            dispatch(setPopupChildren(message));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <HiOutlineEnvelope />
            <div className={style.TitleBlock}>
                <h1>{watch(['user_email'])}</h1>
                <p>We have sent you a message in Email with the code.</p>
            </div>
            <FormInput errors={errors} field="user_code">
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Code"
                    {...register('user_code', {
                        required: 'Code is required',
                        pattern: {
                            value: /^\d{6}$/,
                            message: 'Code must be at least 6 numbers long',
                        },
                    })}
                />
            </FormInput>
            <div className={style.ButtonBlock}>
                <FormButton
                    foo={event => {
                        handleStep(event, 0);
                    }}
                >
                    PREV
                </FormButton>
                <FormButton foo={handleConfirmation}>NEXT</FormButton>
            </div>
        </>
    );
};

export default Step2;
