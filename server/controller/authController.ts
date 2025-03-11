import ApiError from "../error/ApiError"
import models from "../model/models"
import {Request, Response} from "express"
import authService from "../service/authService"
import AuthService from "../service/authService";

class AuthController {
    async registration(req: Request, res: Response): Promise<any> {
        try {
            const userData = await authService.registration(req.body, req.files)
            if (userData instanceof ApiError) return res.json(userData)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while registration'))
        }
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const {user_email, user_password} = req.body

            console.log(user_email, user_password)

            const isExisting = await models.users.findOne({where: {user_email: user_email}})

            if (isExisting) {
                const userData = await authService.login(user_email, user_password)
                if (userData instanceof ApiError) return res.json(userData)

                res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

                return res.json(userData)
            }

            return res.json({registration: true})
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while login'))
        }
    }

    async logout(req: Request, res: Response): Promise<any> {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')

            return res.json(token)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while logging out"))
        }
    }

    async deleteAccount(req: Request, res: Response): Promise<any> {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.deleteAccount(refreshToken, req.body.user_id)
            res.clearCookie('refreshToken')

            return res.json(token)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while deleting account"))
        }
    }

    async sendCode(req: Request, res: Response): Promise<any> {
        try {
            const email = req.body.email

            if (!email) return res.json(ApiError.internalServerError('An error occurred while sending the email'))
            const resData = await authService.sendCode(email)

            return res.json(resData)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while activating account'))
        }
    }

    async confirmEmail(req: Request, res: Response): Promise<any> {
        try {
            const {user_code, user_email} = req.body

            if (!user_code || !user_email) return res.json(ApiError.internalServerError("An error occurred while confirming an email"))

            const resData = await AuthService.confirmEmail(user_code, user_email)

            return res.json(resData)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while activating account'))
        }
    }

    async refresh(req: Request, res: Response): Promise<any> {
        try {
            const {refreshToken} = req.cookies
            const userData = await authService.refresh(refreshToken)

            if (userData instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while refreshing'))

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while refreshing"))
        }
    }
}

export default new AuthController()