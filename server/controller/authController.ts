import ApiError from "../error/ApiError"
import models from "../model/models"
import {NextFunction, Request, Response} from "express"
import authService from "../service/authService"
import AuthService from "../service/authService";

class AuthController {
    registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = await authService.registration(req.body, req.files)
            if (userData instanceof ApiError) {
                res.json(userData)
                return
            }

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            res.json(userData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while registration'))
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_email, user_password} = req.body
            const isExisting = await models.users.findOne({where: {user_email: user_email}})

            if (isExisting) {
                const userData = await authService.login(user_email, user_password)

                res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

                res.json(userData)
            }

            res.json({registration: true})
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while login'))
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')

            res.json(token)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while logging out"))
        }
    };

    deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.deleteAccount(refreshToken, req.body.user_id)
            res.clearCookie('refreshToken')

            res.json(token)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while deleting account"))
        }
    };

    sendCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body.email

            if (!email) return next(ApiError.internalServerError('An error occurred while sending the email'))
            const resData = await authService.sendCode(email)

            res.json(resData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while activating account'))
        }
    };

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_code, user_email} = req.body

            if (!user_code || !user_email) return next(ApiError.internalServerError("An error occurred while confirming an email"))

            const resData = await AuthService.confirmEmail(user_code, user_email)

            res.json(resData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while activating account'))
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const userData = await authService.refresh(refreshToken)


            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(userData)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while refreshing"))
        }
    };
}

export default new AuthController()