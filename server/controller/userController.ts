import ApiError from "../error/ApiError"
import {Request, Response} from "express"
import UserService from "../service/userService"

class UserController {
    async fetchMessenger(req: Request, res: Response): Promise<any> {
        try {
            const {user_id, messenger_id} = req.query
            if (!user_id || !messenger_id || typeof user_id !== "string" || typeof messenger_id !== "string") return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))

            const messengers = await UserService.fetchMessenger(user_id, messenger_id)

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

            const data = await UserService.postMessage(message, req.files)

            if (data instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while posting the message'))

            return res.json(data)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while posting the message'))
        }
    }
    async deleteMessage(req: Request, res: Response): Promise<any> {
        try {
            const {message_id, messenger_id} = req.query

            if (!message_id || !messenger_id || typeof message_id !== 'string' || typeof messenger_id !== 'string')return res.json(ApiError.internalServerError('An error occurred while deleting the message'))

            await UserService.deleteMessage(message_id, messenger_id)

            return res.json(message_id)
        } catch (e) {
            return res.json(ApiError.internalServerError('An error occurred while deleting the message'))
        }
    }
    async getProfile(req: Request, res: Response): Promise<any> {
        try {

        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching a profile"))
        }
        const {user_id} = req.params

        if (!user_id)
            return res.json(ApiError.internalServerError('An error occurred while fetching a profile'))

        const profile = await UserService.getProfile(user_id)

        return res.json(profile)
    }
    async putProfile(req: Request, res: Response): Promise<any> {
        try {
            const {user_id} = req.params
            const {user_name, user_bio} = req.body

            if (!user_id || !user_name)
                return res.json(ApiError.internalServerError('An error occurred while updating a profile'))

            const profile = await UserService.putProfile(user_id, user_name, user_bio, req.files)

            return res.json(profile)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating a profile"))
        }
    }
}

export default new UserController()