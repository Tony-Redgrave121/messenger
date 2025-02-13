import tokenService from "./tokenService"
import ApiError from "../error/ApiError"
import models from "../model/models"
import * as uuid from "uuid"
import IUser from "../types/IUser"
import bcrypt from "bcrypt"
import filesUploadingService from "./filesUploadingService"
import mailService from "./mailService"
import { UploadedFile } from 'express-fileupload'
import IRegistrationResponse from "../types/IRegistrationResponse";
import path from "path";
import * as fs from "fs";

interface IUserFiles {
    user_image?: UploadedFile
}

interface IRegistrationResponseExtend extends IRegistrationResponse {
    user_id: string
    user_email: string
    user_state: boolean
}

class AuthService {
    async registration(user_body: IUser, user_files?: IUserFiles | null): Promise<IRegistrationResponseExtend | ApiError> {
        const {user_name, user_email, user_password, user_bio} = user_body
        const userCheck = await models.users.findOne({where: {user_email: user_email}})
        if(userCheck) return ApiError.badRequest(`User with email already exists`)

        let userImg = null
        const user_id = uuid.v4(), user_activation_code = uuid.v4()

        console.log(user_files)

        if (user_files && user_files.user_image) userImg = filesUploadingService(`users/${user_id}`, user_files.user_image)

        if (userImg instanceof ApiError) return ApiError.badRequest(`Error with user image creation`)

        const hash_user_password = await bcrypt.hash(user_password, 5)
        await models.users.create({user_id: user_id, user_name, user_email, user_password: hash_user_password, user_img: userImg ? userImg.file : null, user_activation_code: user_activation_code, user_bio: user_bio})

        const tokens = tokenService.generateToken({user_id, user_email, user_name})
        await tokenService.saveToken(user_id, tokens!.refreshToken)
        await mailService.sendMail(user_email, `${process.env.API_URL}/activate/${user_activation_code}`)

        return {
            ...tokens,
            user_id: user_id,
            user_name: user_name,
            user_email: user_email,
            user_state: false,
            user_img: userImg ? userImg.file : null
        }
    }

    async login(user_body: { user_email: string, user_password: string }) {
        const {user_email, user_password} = user_body
        const user: IUser | null = await models.users.findOne({where: {user_email: user_email}}) as IUser | null

        if (!user) return ApiError.notFound("User account not found")

        let comparePassword = bcrypt.compareSync(user_password, user.user_password)
        if (!comparePassword) return ApiError.forbidden('Password is incorrect')

        const tokens = tokenService.generateToken({user_id: user.user_id, user_email})
        await tokenService.saveToken(user.user_id, tokens!.refreshToken)

        return {
            ...tokens,
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_state: user.user_state,
            user_img: user.user_img,
        }
    }

    async logout(refreshToken: string) {
        return await tokenService.deleteToken(refreshToken)
    }

    async deleteAccount(refreshToken: string, user_id: string) {
        await models.users.destroy({where: {user_id: user_id}})

        const folderPath = path.resolve(__dirname + "/../src/static/users", user_id)

        fs.rmSync(folderPath, { recursive: true, force: true })

        return await tokenService.deleteToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) return ApiError.unauthorized("Unauthorized")
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenDB = tokenService.findToken(refreshToken)
        if (!userData || !tokenDB || typeof userData === "string") return ApiError.unauthorized("Unauthorized")

        const user: IUser | null = await models.users.findOne({where: {user_id: userData.user_id}}) as IUser | null

        if (!user) return ApiError.unauthorized("Unauthorized")

        const tokens = tokenService.generateToken({user_id: user.user_id, user_email: user.user_email} )

        await tokenService.saveToken(user.user_id, tokens!.refreshToken)
        await tokenService.deleteToken(refreshToken)

        return {
            ...tokens,
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_state: user.user_state,
            user_img: user.user_img,
        }
    }
}

export default new AuthService()