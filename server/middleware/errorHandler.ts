import ApiError from '../error/ApiError.js'
import {ErrorRequestHandler} from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.status).json({message: err.message})
        return
    }

    res.status(500).json({message: 'Internal Server Error'})
}

export default errorHandler