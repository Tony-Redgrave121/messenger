import React, { useEffect } from 'react';
import { useAppDispatch } from '@shared/lib';
import { useNavigate } from 'react-router-dom';
import { setPopupChildren, setPopupState } from '@features/PopupMessage/model/slice/popupSlice';

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
