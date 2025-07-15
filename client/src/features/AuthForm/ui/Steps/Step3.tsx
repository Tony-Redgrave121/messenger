import React, { FC } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { HiOutlineFingerPrint } from 'react-icons/hi2';
import AuthFormSchema from '@features/AuthForm/model/types/AuthFormSchema';
import { setPopupChildren, setPopupState } from '@features/PopupMessage/model/slice/popupSlice';
import { login } from '@entities/User/lib/thunk/userThunk';
import { useAppDispatch } from '@shared/lib';
import { FormButton } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';
import AuthStepSchema from '../../model/types/AuthStepSchema';
import style from './step.module.css';

interface IStep3Props extends AuthStepSchema {
    watch: UseFormWatch<AuthFormSchema>;
}

const Step3: FC<IStep3Props> = ({ errors, register, handleStep, watch }) => {
    const dispatch = useAppDispatch();

    const handlePassword = async (event?: React.MouseEvent<HTMLButtonElement>) => {
        if (!event) return;

        try {
            const formData = new FormData();
            formData.append('user_email', watch('user_email'));
            formData.append('user_password', watch('user_password'));

            const res = await dispatch(login({ formData: formData }));

            if (login.rejected.match(res)) {
                dispatch(setPopupState(true));
                dispatch(setPopupChildren(res.payload || 'Server error'));
                return;
            }

            handleStep(event, 3);
        } catch (e) {
            const error = e as Error;

            dispatch(setPopupState(true));
            dispatch(setPopupChildren(error.message));
        }
    };

    return (
        <>
            <HiOutlineFingerPrint />
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
                        required: 'Password is required',
                        pattern: {
                            value: /^.{8,}$/,
                            message: 'Password must be at least 8 characters long',
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
                <FormButton foo={handlePassword}>NEXT</FormButton>
            </div>
        </>
    );
};

export default Step3;
