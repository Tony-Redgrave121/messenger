import ApiError from "../error/ApiError"
import {Request, Response} from "express"
import UserService from "../service/userService"
import userService from "../service/userService";

class UserController {
    async fetchMessenger(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params) return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))
            const messengers = await UserService.fetchMessenger(req.params.user_id)

            if (messengers instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))

            return res.json(messengers)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messenger"))
        }
    }

    async fetchMessengersList(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params) return res.json(ApiError.internalServerError('An error occurred while fetching messengers list'))
            const messengers = await UserService.fetchMessengersList(req.params.user_id)

            if (messengers instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching messengers list'))

            return res.json(messengers)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching messengers list"))
        }
    }

    async fetchMessages(req: Request, res: Response): Promise<any> {
        try {
            const {user_id, messenger_id} = req.query

            if (!user_id || !messenger_id || typeof user_id !== 'string' || typeof messenger_id !== 'string') return res.json(ApiError.internalServerError('An error occurred while fetching messages'))
            const messages = await UserService.fetchMessages(user_id, messenger_id)

            if (messages instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching messages'))

            return res.json(messages)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messages"))
        }
    }

    async postMessage(req: Request, res: Response): Promise<any> {
        try {
            const {user_id, messenger_id, reply_id, message_text, message_type} = req.body

            if (!user_id || !messenger_id || !message_type) return res.json(ApiError.internalServerError('An error occurred while posting the message'))

            const message = {
                user_id: user_id,
                messenger_id: messenger_id,
                reply_id: reply_id ? reply_id : null,
                message_text: message_text,
                message_type: message_type
            }

            const data = await userService.postMessage(message, req.files)

            if (data instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while posting the message'))

            return true
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while posting the message'))
        }
    }
}

export default new UserController()