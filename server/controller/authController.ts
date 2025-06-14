import ApiError from "../error/ApiError"
import models from "../model/models"
import {NextFunction, Request, Response} from "express"
import AuthService from '../service/authService'
import {COOKIE_OPTIONS} from "../utils/cookieOptions";

class AuthController {
    constructor(private readonly authService: AuthService) {}

    public registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = await this.authService.registration(req.body, req.files)
            if (userData instanceof ApiError) {
                res.json(userData)
                return
            }

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            res.json(userData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while registration'))
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_email, user_password} = req.body
            const isExisting = await models.users.findOne({where: {user_email: user_email}})

            if (isExisting) {
                const userData = await this.authService.login(user_email, user_password)

                res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

                res.json(userData)
            }

            res.json({registration: true})
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while login'))
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const token = await this.authService.logout(refreshToken)
            res.clearCookie('refreshToken')

            res.json(token)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while logging out"))
        }
    }

    public deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const token = await this.authService.deleteAccount(refreshToken, req.body.user_id)
            res.clearCookie('refreshToken')

            res.json(token)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while deleting account"))
        }
    }

    public sendCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body.email

            if (!email) return next(ApiError.internalServerError('An error occurred while sending the email'))
            const resData = await this.authService.sendCode(email)

            res.json(resData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while activating account'))
        }
    }

    public confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_code, user_email} = req.body

            if (!user_code || !user_email) return next(ApiError.internalServerError("An error occurred while confirming an email"))

            const resData = await this.authService.confirmEmail(user_code, user_email)

            res.json(resData)
        } catch (e) {
            next(ApiError.internalServerError('An error occurred while activating account'))
        }
    }

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const userData = await this.authService.refresh(refreshToken)

            this.setRefreshToken(res, userData.refreshToken)
            res.json(userData)
        } catch (e) {
            next(ApiError.internalServerError("An error occurred while refreshing"))
        }
    }

    private setRefreshToken(res: Response, token: string) {
        res.cookie('refreshToken', token, COOKIE_OPTIONS)
    }

    private clearRefreshToken(res: Response) {
        res.clearCookie('refreshToken', COOKIE_OPTIONS)
    }
}

export default AuthController