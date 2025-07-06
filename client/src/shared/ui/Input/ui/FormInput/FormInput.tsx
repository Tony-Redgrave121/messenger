import { FC, memo, ReactNode } from 'react';
import style from './style.module.css';
import { FieldErrors } from 'react-hook-form';

interface IFormInputProps {
    children: ReactNode;
    errors: FieldErrors;
    field: string;
}

const FormInput: FC<IFormInputProps> = memo(({ children, errors, field }) => {
    return (
        <div className={style.FormInput}>
            <label htmlFor={field} />
            {children}
            <small>{errors[field] && `${errors[field]!.message?.toString()}*`}</small>
        </div>
    );
});

export default FormInput;
