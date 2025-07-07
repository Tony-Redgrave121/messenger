import { FC, memo, ReactNode } from 'react';
import { FieldErrors } from 'react-hook-form';
import style from './style.module.css';

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

FormInput.displayName = 'FormInput';

export default FormInput;
