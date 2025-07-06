import { UseFormRegister } from 'react-hook-form';
import React from 'react';

export default interface AuthStepSchema {
    errors: Record<string, any>;
    register: UseFormRegister<any>;
    handlePrev?: (event: React.MouseEvent<HTMLButtonElement>, num: number) => void;
    handleNext?: (
        event: React.MouseEvent<HTMLButtonElement>,
        name:
            | 'user_code'
            | 'user_image'
            | 'user_name'
            | 'user_bio'
            | 'user_email'
            | 'user_password',
        num: number,
    ) => void;
}
