import React from 'react';
import { AuthForm } from '@widgets/AuthForm';
import style from './auth.module.css';

const AuthPage = () => {
    return (
        <div className={style.AuthContainer}>
            <AuthForm />
        </div>
    );
};

export default AuthPage;
