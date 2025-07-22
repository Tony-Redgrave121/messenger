import ApiError from "../errors/apiError"
import {NextFunction, Request, Response} from "express"
import validateQueryParams from "../utils/validation/validateQueryParams";
import MessageService from "../services/message.service";
import ensureRequiredFields from "../utils/validation/ensureRequiredFields";

class MessageController {
    constructor(private readonly messageService: MessageService) {}

    public fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = validateQueryParams(req.query, ['type', 'user_id', 'messenger_id'])
            const {type, user_id, messenger_id} = validatedData
            const {post_id} = req.query

            if (typeof post_id !== "undefined" && typeof post_id !== "string") {
                return next(ApiError.badRequest('Missing required fields'))
            }

            const messages = await this.messageService.fetchMessages(type, user_id, messenger_id, post_id)

            res.json(messages)
        } catch (e) {
            next(e)
        }
    };

    public fetchMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = validateQueryParams(req.query, ['message_id', 'messenger_id'])
            const {messenger_id, message_id} = validatedData

            const message = await this.messageService.fetchMessage(message_id, messenger_id)
            res.json(message)
        } catch (e) {
            next(e)
        }
    };

    public postMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id, messenger_id, reply_id, message_text, message_type, recipient_user_id, post_id} = req.body
            ensureRequiredFields([user_id, message_type])

            const message = {
                user_id: user_id,
                messenger_id: messenger_id,
                reply_id: reply_id || null,
                post_id: post_id || null,
                message_text: message_text,
                message_type: message_type,
                recipient_user_id: recipient_user_id
            }

            const data = await this.messageService.postMessage(message, req.files)
            res.json(data)
        } catch (e) {
            next(e)
        }
    };

    public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id} = req.params
            ensureRequiredFields([message_id])

            await this.messageService.deleteMessage(message_id)
            res.json(message_id)
        } catch (e) {
            next(e)
        }
    };

    public postMessageReaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id} = req.params
            const {reaction_id, user_id} = req.body

            ensureRequiredFields([message_id, user_id, reaction_id])

            const reaction = await this.messageService.postMessageReaction(message_id, user_id, reaction_id)
            res.json(reaction)
        } catch (e) {
            return next(e)
        }
    };

    public deleteMessageReaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id} = req.params
            const validatedData = validateQueryParams(req.query, ['reaction_id', 'user_id'])

            ensureRequiredFields([message_id])

            const {reaction_id, user_id} = validatedData
            const reaction = await this.messageService.deleteMessageReaction(message_id, user_id, reaction_id)

            res.json(reaction)
        } catch (e) {
            return next(e)
        }
    };
}

export default MessageController