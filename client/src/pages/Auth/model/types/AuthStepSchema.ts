import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import AuthFormSchema from '@pages/Auth/model/types/AuthFormSchema';

export default interface AuthStepSchema {
    errors: FieldErrors<AuthFormSchema>;
    register: UseFormRegister<AuthFormSchema>;
    handleStep: (event: React.MouseEvent<HTMLButtonElement> | undefined, num: number) => void;
}
