import jwt from "jsonwebtoken"
import models from "../model/models"
import * as uuid from "uuid"
import ApiError from "../error/ApiError"

class TokenService {
    private readonly accessSecret: string
    private readonly refreshSecret: string

    constructor() {
        const {SECRET_ACCESS_KEY, SECRET_REFRESH_KEY} = process.env

        if (!SECRET_ACCESS_KEY || !SECRET_REFRESH_KEY) {
            throw ApiError.internalServerError('Missing JWT secrets environment variables')
        }

        this.accessSecret = SECRET_ACCESS_KEY
        this.refreshSecret = SECRET_REFRESH_KEY
    }

    generateToken(payload: object) {
        const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: '7d'})
        const refreshToken = jwt.sign(payload, this.refreshSecret, {expiresIn: '14d'})

        return {accessToken, refreshToken}
    }

    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, this.refreshSecret)
        } catch (e) {
            return null
        }
    }

    async saveToken(user_id: string, user_token_body: string) {
        return await models.user_tokens.create({user_token_id: uuid.v4(), user_token_body, user_id})
    }

    async deleteToken(user_token_body: string) {
        return await models.user_tokens.destroy({where: {user_token_body: user_token_body}})
    }

    async findToken(user_token_body: string) {
        return await models.user_tokens.findOne({where: {user_token_body: user_token_body}})
    }
}

export default TokenService