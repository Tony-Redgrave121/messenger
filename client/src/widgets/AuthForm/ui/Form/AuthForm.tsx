import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './auth-form.animation.css';
import useAuthForm from '@widgets/AuthForm/lib/hooks/useAuthForm';
import Step1 from '@widgets/AuthForm/ui/Steps/Step1';
import Step2 from '@widgets/AuthForm/ui/Steps/Step2';
import Step3 from '@widgets/AuthForm/ui/Steps/Step3';
import Step4 from '@widgets/AuthForm/ui/Steps/Step4';
import { PopupMessage } from '@entities/Message';
import style from './auth-form.module.css';

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
