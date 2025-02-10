import ApiError from "../error/ApiError"
import models from "../model/models"
import {Request, Response} from "express"
import authService from "../service/authService"
import IUser from "../types/IUser"

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
            const userData = await authService.login(req.body)
            if (userData instanceof ApiError) return res.json(userData)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
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

    async activate(req: Request, res: Response): Promise<any> {
        try {
            const link = req.params.link
            const user: IUser | null = await models.users.findOne({where: {user_activation_link: link}}) as IUser | null
            if (!user) return res.json(ApiError.notFound("User not found")).redirect(process.env.CLIENT_URL!)

            user.user_state = true
            await user.save()

            return res.redirect(process.env.CLIENT_URL!)
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