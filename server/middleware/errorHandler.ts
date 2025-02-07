import ApiError from '../error/ApiError.js'
import {Request, Response, NextFunction} from "express";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError)  res.status(err.status).json({message: err.message})
    res.status(500).json({message: 'Internal Server Error'})
}

export default errorHandler