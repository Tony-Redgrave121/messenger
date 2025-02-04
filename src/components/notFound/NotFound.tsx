import React from 'react'
import {Link} from "react-router-dom";
import style from './style.module.css';

const NotFound = () => {
    return (
        <div className={style.NotFoundContainer}>
            <h1><i>404</i></h1>
            <h2>You've got the wrong door boy</h2>
            <Link to="/">Go back to Home page</Link>
        </div>
    )
}

export default NotFound