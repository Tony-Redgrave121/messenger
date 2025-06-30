import React, {useEffect} from 'react';
import {useAppDispatch} from "../../../shared/lib";
import {useNavigate} from "react-router-dom";
import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";

const PageError = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(setPopupMessageState(true))
        dispatch(setPopupMessageChildren('An unforeseen error occurred'))
        navigate('/')
    }, [])

    return (
        <></>
    );
};

export default PageError;