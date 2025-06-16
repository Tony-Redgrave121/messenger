import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import AuthService from "../service/authService"
import {COOKIE_OPTIONS} from "../utils/cookieOptions"
import ensureRequiredFields from "../shared/validation/ensureRequiredFields";

class AuthController {
    constructor(private readonly authService: AuthService) {}

    public registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_name, user_email, user_password, user_bio} = req.body
            ensureRequiredFields([user_name, user_email, user_password])

            const result = await this.authService.registration(user_name, user_email, user_password, user_bio, req.files)

            this.setRefreshToken(res, result.refreshToken)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_email, user_password} = req.body
            ensureRequiredFields([user_email, user_password])

            const result = await this.authService.login(user_email, user_password)

            if (!(result instanceof ApiError)) this.setRefreshToken(res, result.refreshToken)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            await this.authService.logout(refreshToken)

            this.clearRefreshToken(res)
            res.sendStatus(204)
        } catch (e) {
            next(e)
        }
    }

    public deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const {user_id} = req.body
            await this.authService.deleteAccount(refreshToken, user_id)

            this.clearRefreshToken(res)
            res.sendStatus(204)
        } catch (e) {
            next(e)
        }
    }

    public sendCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email} = req.body
            ensureRequiredFields([email])

            const result = await this.authService.sendCode(email)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    public confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_code, user_email} = req.body
            ensureRequiredFields([user_code, user_email])

            const result = await this.authService.confirmEmail(user_code, user_email)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies
            const result = await this.authService.refresh(refreshToken)

            this.setRefreshToken(res, result.refreshToken)
            res.json(result)
        } catch (e) {
            next(e)
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