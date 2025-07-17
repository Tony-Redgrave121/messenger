import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPopupChildren, setPopupState } from '@entities/Message';
import { useAppDispatch } from '@shared/lib';

const PageError = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPopupState(true));
        dispatch(setPopupChildren('An unforeseen error occurred'));
        navigate('/');
    }, []);

    return <></>;
};

export default PageError;
