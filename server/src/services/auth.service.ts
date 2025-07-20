import ApiError from "../errors/apiError"
import index from "../models"
import * as uuid from "uuid"
import IUser from "../types/userTypes/IUser"
import bcrypt from "bcrypt"
import {UploadedFile} from "express-fileupload"
import path from "path"
import * as fs from "fs"
import getRandomCryptoValue from "../utils/getRandomCryptoValue"
import uploadFile from "../utils/uploadFile"
import MailService from "./mail.service"
import TokenService from "./token.service"
import IUserFiles from "../types/fileTypes/IUserFiles";
import {resizeImage} from "../utils/resizeImage";
import getImageExtension from "../utils/getImageExtension";

class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
    ) {
    }

    public registration = async (
        user_name: string,
        user_email: string,
        user_password: string,
        user_bio: string,
        user_files?: IUserFiles | null
    ) => {
        const existingUser = await index.users.findOne({where: {user_email: user_email}})
        if (existingUser) throw ApiError.badRequest(`User already exists`)

        const user_id = uuid.v4()
        const activationCode = uuid.v4()
        const hashedPassword = await bcrypt.hash(user_password, 5)
        const user_img = await this.uploadUserImage(user_id, user_files?.user_img)

        await index.users.create({
            user_id: user_id,
            user_name,
            user_email,
            user_password: hashedPassword,
            user_img,
            user_activation_code: activationCode,
            user_bio: user_bio
        })

        const tokens = await this.handleTokenSaving(user_id, {user_id, user_email, user_name})

        return {
            ...tokens,
            user_id,
            user_name,
            user_email,
            user_state: false,
            user_bio,
            user_img
        }
    }

    public login = async (user_email: string, user_password: string) => {
        const user = await this.getUser({user_email})
        if (user instanceof ApiError) return true

        let isPasswordValid = await bcrypt.compare(user_password, user.user_password)
        if (!isPasswordValid) return ApiError.forbidden('Password is incorrect')

        const tokens = await this.handleTokenSaving(user.user_id, {
            user_id: user.user_id,
            user_email: user.user_email,
        })

        return {
            ...tokens,
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_state: user.user_state,
            user_bio: user.user_bio,
            user_img: user.user_img,
        }
    }

    public sendCode = async (user_code_email: string) => {
        const user_code_body = getRandomCryptoValue(100000, 999999)
        const user_code_id = uuid.v4()

        await this.mailService.sendMail(user_code_email, user_code_body)

        return await index.user_code.create({user_code_id, user_code_email, user_code_body})
    }

    public confirmEmail = async (user_code: number, user_email: string) => {
        const userCode = await index.user_code.findOne({
            where: {
                user_code_email: user_email,
                user_code_body: user_code
            }
        })

        if (!userCode) return ApiError.notFound("Invalid code")

        return userCode
    }

    public logout = async (refreshToken: string) => {
        return await this.tokenService.deleteToken(refreshToken)
    }

    public deleteAccount = async (refreshToken: string, user_id: string) => {
        await index.users.destroy({where: {user_id: user_id}})

        const folderPath = path.join(__dirname + "../../static/users", user_id)
        await fs.promises.rm(folderPath, {recursive: true, force: true})

        return await this.tokenService.deleteToken(refreshToken)
    }

    public refresh = async (refreshToken: string) => {
        if (!refreshToken) throw ApiError.unauthorized("No token provided")

        const userData = this.tokenService.validateRefreshToken(refreshToken)
        const tokenDB = this.tokenService.findToken(refreshToken)

        if (!userData || !tokenDB || typeof userData === "string") {
            throw ApiError.unauthorized("Invalid token")
        }

        const user = await this.getUser({user_id: userData.user_id})

        if (user instanceof ApiError) throw user

        const user_id = user.user_id, user_email = user.user_email
        const tokens = await this.handleTokenSaving(user_id, {user_id, user_email})

        await this.tokenService.deleteToken(refreshToken)

        return {
            ...tokens,
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_state: user.user_state,
            user_bio: user.user_bio,
            user_img: user.user_img,
        }
    }

    private async getUser(where: Partial<IUser>): Promise<IUser | ApiError> {
        const user = await index.users.findOne({where}) as IUser | null
        if (!user) return ApiError.notFound("User not found")

        return user
    }

    private async uploadUserImage(user_id: string, file?: UploadedFile | null): Promise<string | null> {
        if (!file) return null

        const {isImage, extension} = getImageExtension(file)
        if (!extension || !isImage) throw ApiError.badRequest('The file extension is missing or the file is not an image');

        const resizedBuffer = await resizeImage(file.data, 500, 500, extension as 'jpeg' | 'png' | 'webp' | 'jpg');
        const resizedFile: UploadedFile = {
            ...file,
            data: resizedBuffer,
            size: resizedBuffer.length,
        };

        const uploadResult = await uploadFile(`users/${user_id}`, resizedFile, 'media')
        if (!uploadResult || uploadResult instanceof ApiError) {
            throw ApiError.badRequest("Failed to upload user image")
        }

        return uploadResult.file || null
    }

    private handleTokenSaving = async (user_id: string, payload: object) => {
        const tokens = this.tokenService.generateToken(payload)
        if (!tokens) throw ApiError.internalServerError("Token generation failed")

        await this.tokenService.saveToken(user_id, tokens.refreshToken)
        return tokens
    }
}

export default AuthService