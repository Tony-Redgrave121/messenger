import ApiError from "../error/ApiError"
import {Request, Response} from "express"
import UserService from "../service/userService"

class UserController {
    async fetchMessenger(req: Request, res: Response): Promise<any> {
        try {
            const {type, user_id, messenger_id} = req.query

            if (!type || !user_id || !messenger_id || typeof type !== "string" || typeof user_id !== "string" || typeof messenger_id !== "string")
                return res.json(ApiError.badRequest('Missing required fields'))

            const messengers = await UserService.fetchMessenger(type, user_id, messenger_id)

            if (messengers instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))

            return res.json(messengers)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messenger"))
        }
    }

    async fetchMessengersList(req: Request, res: Response): Promise<any> {
        try {
            const user_id = req.params.user_id
            if (!user_id) return res.json(ApiError.badRequest('Missing required fields'))

            const messengers = await UserService.fetchMessengersList(user_id)

            if (messengers instanceof ApiError)
                return res.json(ApiError.internalServerError('An error occurred while fetching messengers list'))

            return res.json(messengers)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching messengers list"))
        }
    }

    async fetchMessages(req: Request, res: Response): Promise<any> {
        try {

        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messages"))
        }

        const {type, user_id, messenger_id, post_id} = req.query

        if (
            !user_id ||
            !type ||
            !messenger_id ||
            typeof type !== 'string' ||
            typeof post_id !== 'string' ||
            typeof user_id !== 'string' ||
            typeof messenger_id !== 'string'
        )
            return res.json(ApiError.badRequest('Missing required fields'))
        const messages = await UserService.fetchMessages(type, user_id, messenger_id, post_id)

        if (messages instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching messages'))

        return res.json(messages)
    }

    async postMessage(req: Request, res: Response): Promise<any> {
        try {
            const {user_id, messenger_id, reply_id, message_text, message_type, recipient_user_id, post_id} = req.body

            if (!user_id || !message_type)
                return res.json(ApiError.badRequest('Missing required fields'))

            const message = {
                user_id: user_id,
                messenger_id: messenger_id,
                reply_id: reply_id ? reply_id : null,
                post_id: post_id ? post_id : null,
                message_text: message_text,
                message_type: message_type,
                recipient_user_id: recipient_user_id
            }

            const data = await UserService.postMessage(message, req.files)

            if (data instanceof ApiError)
                return res.json(ApiError.internalServerError('An error occurred while posting the message'))

            return res.json(data)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while posting the message'))
        }
    }

    async deleteMessage(req: Request, res: Response): Promise<any> {
        try {
            const {message_id} = req.query

            if (!message_id || typeof message_id !== 'string')
                return res.json(ApiError.badRequest('Missing required fields'))

            await UserService.deleteMessage(message_id)

            return res.json(message_id)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while deleting the message'))
        }
    }

    async getProfile(req: Request, res: Response): Promise<any> {
        try {
            const {user_id} = req.params

            if (!user_id)
                return res.json(ApiError.badRequest('Missing required fields'))

            const profile = await UserService.getProfile(user_id)

            return res.json(profile)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching a profile"))
        }
    }

    async putProfile(req: Request, res: Response): Promise<any> {
        try {
            const {user_id} = req.params
            const {user_name, user_bio} = req.body

            if (!user_id || !user_name)
                return res.json(ApiError.badRequest('Missing required fields'))

            const profile = await UserService.putProfile(user_id, user_name, user_bio, req.files)

            return res.json(profile)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating a profile"))
        }
    }

    async putPassword(req: Request, res: Response): Promise<any> {
        try {
            const {user_id} = req.params
            const {user_password, user_password_new} = req.body

            if (!user_id || !user_password || !user_password_new)
                return res.json(ApiError.badRequest('Missing required fields'))

            const password = await UserService.putPassword(user_id, user_password, user_password_new)

            if (password instanceof ApiError) return res.json(password)

            return res.json({
                status: 200,
                message: password
            })
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating a password"))
        }
    }
}

export default new UserController()