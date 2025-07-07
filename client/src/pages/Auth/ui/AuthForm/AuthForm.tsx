import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import PopupMessage from '@features/PopupMessage/ui/PopupMessage';
import { Step1, Step2, Step3, Step4 } from '../../index';
import AuthFormSchema from '../../model/types/AuthFormSchema';
import style from './auth-form.module.css';
import './auth-form.animation.css';

const InitialValues: AuthFormSchema = {
    user_email: '',
    user_code: undefined,
    user_password: '',
    user_image: null,
    user_name: '',
    user_bio: '',
};

const AuthForm = () => {
    const [formNumber, setFormNumber] = useState(0);
    const [formState, setFormState] = useState(true);
    const refForm = useRef<HTMLFieldSetElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        control,
    } = useForm({ defaultValues: InitialValues });

    const handleStep = (event: React.MouseEvent<HTMLButtonElement> | undefined, num: number) => {
        if (!event) return;
        event.preventDefault();

        setFormState(false);
        setTimeout(() => {
            setFormNumber(num);
            setFormState(true);
        }, 300);
    };

    const steps = [
        {
            id: 0,
            component: (
                <Step1
                    register={register}
                    handleStep={handleStep}
                    errors={errors}
                    trigger={trigger}
                    watch={watch}
                />
            ),
        },
        {
            id: 1,
            component: (
                <Step2
                    register={register}
                    handleStep={handleStep}
                    errors={errors}
                    watch={watch}
                    trigger={trigger}
                />
            ),
        },
        {
            id: 2,
            component: (
                <Step3 register={register} handleStep={handleStep} errors={errors} watch={watch} />
            ),
        },
        {
            id: 3,
            component: (
                <Step4
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    handleStep={handleStep}
                    control={control}
                />
            ),
        },
    ];

    return (
        <div className={style.AuthContainer}>
            <form noValidate className={style.AuthForm}>
                <CSSTransition
                    in={formState}
                    nodeRef={refForm}
                    timeout={300}
                    classNames="form-node"
                    unmountOnExit
                >
                    <fieldset disabled={!formState} ref={refForm}>
                        {steps[formNumber].component}
                    </fieldset>
                </CSSTransition>
            </form>
            <PopupMessage />
        </div>
    );
};

export default AuthForm;
