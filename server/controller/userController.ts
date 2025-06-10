import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import UserService from "../service/userService"

class UserController {
    fetchMessenger = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const {type, user_id, messenger_id} = req.query

            if (
                !type ||
                !user_id ||
                !messenger_id ||
                typeof type !== "string" ||
                typeof user_id !== "string" ||
                typeof messenger_id !== "string"
            ) return next(ApiError.badRequest('Missing required fields'))

            const messenger = await UserService.fetchMessenger(type, user_id, messenger_id)

            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    };

    fetchMessengersList = async(req: Request, res: Response, next: NextFunction)=> {
        try {
            const user_id = req.params.user_id
            if (!user_id) return next(ApiError.badRequest('Missing required fields'))

            const messengers = await UserService.fetchMessengersList(user_id)

            if (messengers instanceof ApiError)
                return next(ApiError.internalServerError('An error occurred while fetching messengers list'))

            res.json(messengers)
        } catch (e) {
            return next(e)
        }
    };

    fetchMessages = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const {type, user_id, messenger_id, post_id} = req.query

            if (
                !user_id ||
                !type ||
                !messenger_id ||
                typeof type !== 'string' ||
                typeof user_id !== 'string' ||
                typeof messenger_id !== 'string'
            ) return next(ApiError.badRequest('Missing required fields'))

            if (typeof post_id === 'string' || typeof post_id === 'undefined') {
                const messages = await UserService.fetchMessages(type, user_id, messenger_id, post_id)

                res.json(messages)
            } else {
                return next(ApiError.badRequest('Missing required fields'))
            }
        } catch (e) {
            return next(e)
        }
    };

    postMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id, messenger_id, reply_id, message_text, message_type, recipient_user_id, post_id} = req.body

            if (!user_id || !message_type)
                return next(ApiError.badRequest('Missing required fields'))

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
                return next(ApiError.internalServerError('An error occurred while posting the message'))

            res.json(data)
        } catch (e) {
            return next(e)
        }
    };

    fetchMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, message_id} = req.query

            if (
                !message_id ||
                !messenger_id ||
                typeof message_id !== 'string' ||
                typeof messenger_id !== 'string'
            ) return next(ApiError.badRequest('Missing required fields'))

            const data = await UserService.fetchMessage(message_id, messenger_id)

            if (data instanceof ApiError)
                return next(ApiError.internalServerError('An error occurred while fetching a message'))

            res.json(data)
        } catch (e) {
            return next(e)
        }
    };

    deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id, post_id} = req.query

            if (
                !message_id ||
                typeof message_id !== 'string' ||
                (typeof post_id !== 'string' && typeof post_id !== 'undefined')
            ) return next(ApiError.badRequest('Missing required fields'))

            await UserService.deleteMessage(message_id, post_id)

            res.json(message_id)
        } catch (e) {
            return next(e)
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params

            if (!user_id)
                return next(ApiError.badRequest('Missing required fields'))

            const profile = await UserService.getProfile(user_id)

            res.json(profile)
        } catch (e) {
            return next(e)
        }
    };

    putProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {user_name, user_bio} = req.body

            if (!user_id || !user_name)
                return next(ApiError.badRequest('Missing required fields'))

            const profile = await UserService.putProfile(user_id, user_name, user_bio, req.files)

            res.json(profile)
        } catch (e) {
            return next(e)
        }
    };

    putPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {user_password, user_password_new} = req.body

            if (!user_id || !user_password || !user_password_new)
                return next(ApiError.badRequest('Missing required fields'))

            const password = await UserService.putPassword(user_id, user_password, user_password_new)

            if (password instanceof ApiError) {
                res.json(password)
                return
            }

            res.json({
                status: 200,
                message: password
            })
        } catch (e) {
            return next(e)
        }
    };
}

export default new UserController()