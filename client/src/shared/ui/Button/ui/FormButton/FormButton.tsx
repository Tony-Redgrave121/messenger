import React, { FC, ReactNode } from 'react';
import formButtonStyle from './form-button.module.css';

interface IFormButton {
    children?: ReactNode;
    foo?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
}

const FormButton: FC<IFormButton> = ({ foo, children, type = 'button' }) => {
    return (
        <button className={formButtonStyle.FormButton} onClick={foo} type={type}>
            {children}
        </button>
    );
};

export default FormButton;
