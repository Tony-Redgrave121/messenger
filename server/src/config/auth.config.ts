import ApiError from "../errors/apiError";
import TokenService from "../services/token.service";
import MailService from "../services/mail.service";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";

const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD} = process.env
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_APP_PASSWORD) {
    throw ApiError.internalServerError("Missing SMTP environment variables")
}

const mailServiceConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_APP_PASSWORD
    }
}

const tokenService = new TokenService()
const mailService = new MailService(mailServiceConfig)
const authService = new AuthService(tokenService, mailService)
const authController = new AuthController(authService)

export default authController