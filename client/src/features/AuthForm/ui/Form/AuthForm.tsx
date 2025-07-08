import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PopupMessage from '@features/PopupMessage/ui/PopupMessage';
import { Step1, Step2, Step3, Step4 } from '../../index';
import useAuthForm from '../../lib/hooks/useAuthForm';
import style from './auth-form.module.css';
import './auth-form.animation.css';

const AuthForm = () => {
    const {
        formNumber,
        formState,
        refForm,
        register,
        handleSubmit,
        errors,
        trigger,
        watch,
        control,
        handleStep,
    } = useAuthForm();

    const steps = [
        <Step1
            register={register}
            handleStep={handleStep}
            errors={errors}
            trigger={trigger}
            watch={watch}
            key={0}
        />,
        <Step2
            register={register}
            handleStep={handleStep}
            errors={errors}
            watch={watch}
            trigger={trigger}
            key={1}
        />,
        <Step3 register={register} handleStep={handleStep} errors={errors} watch={watch} key={2} />,
        <Step4
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            handleStep={handleStep}
            control={control}
            key={3}
        />,
    ];

    return (
        <form noValidate className={style.AuthForm}>
            <CSSTransition
                in={formState}
                nodeRef={refForm}
                timeout={300}
                classNames="form-node"
                unmountOnExit
            >
                <fieldset disabled={!formState} ref={refForm}>
                    {steps[formNumber]}
                </fieldset>
            </CSSTransition>
            <PopupMessage />
        </form>
    );
};

export default AuthForm;
