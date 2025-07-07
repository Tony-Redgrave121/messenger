import React, { FC } from 'react';
import { UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { FormButton } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';
import sendCodeApi from '../../api/sendCodeApi';
import AuthFormSchema from '../../model/types/AuthFormSchema';
import AuthStepSchema from '../../model/types/AuthStepSchema';
import stepStyle from './step.module.css';

interface IStep1Props extends AuthStepSchema {
    watch: UseFormWatch<AuthFormSchema>;
    trigger: UseFormTrigger<AuthFormSchema>;
}

const Step1: FC<IStep1Props> = ({ errors, register, handleStep, watch, trigger }) => {
    const handleCode = async (event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const isValid = await trigger('user_email');

            if (!isValid) return;
            handleStep(event, 1);

            const email = watch('user_email');
            await sendCodeApi(email);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <HiOutlineChatBubbleLeftRight />
            <div className={stepStyle.TitleBlock}>
                <h1>Auth in to Messenger</h1>
                <p>Please enter your email address.</p>
            </div>
            <FormInput errors={errors} field={'user_email'}>
                <input
                    type="email"
                    id="user_email"
                    placeholder="Email Adress"
                    {...register('user_email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                ></input>
            </FormInput>
            <FormButton foo={handleCode}>NEXT</FormButton>
        </>
    );
};

export default Step1;
