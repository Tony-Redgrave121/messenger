import jwt from "jsonwebtoken"
import models from "../model/models"
import * as uuid from "uuid"

class TokenService {
    generateToken(payload: object) {
        if (process.env.SECRET_ACCESS_KEY && process.env.SECRET_REFRESH_KEY) {
            const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: '7d'})
            const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn: '14d'})
            return {accessToken, refreshToken}
        }
    }
    validateRefreshToken(token: string) {
        try {
            return process.env.SECRET_REFRESH_KEY && jwt.verify(token, process.env.SECRET_REFRESH_KEY)
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

export default new TokenService()