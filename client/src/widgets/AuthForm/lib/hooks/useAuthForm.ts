import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthFormSchema from '@widgets/AuthForm/model/types/AuthFormSchema';

const InitialValues: AuthFormSchema = {
    user_email: '',
    user_code: undefined,
    user_password: '',
    user_image: null,
    user_name: '',
    user_bio: '',
};

const useAuthForm = () => {
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

    return {
        formNumber,
        setFormNumber,
        formState,
        setFormState,
        refForm,
        register,
        handleSubmit,
        errors,
        trigger,
        watch,
        control,
        handleStep,
    };
};

export default useAuthForm;
