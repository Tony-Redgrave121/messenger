import ApiError from "../errors/apiError"
import {NextFunction, Request, Response} from "express"
import MessengerManagementService from "../services/messengerManagement.service";
import validateQueryParams from "../utils/validation/validateQueryParams";
import isMessengerKey from "../types/typeGuards/isMessengerKey";
import ensureRequiredFields from "../utils/validation/ensureRequiredFields";

class MessengerManagementController {
    constructor(private readonly messengerManagementService: MessengerManagementService) {
    }

    public fetchMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = validateQueryParams(req.query, ['type', 'messenger_id'])
            const {type, messenger_id} = validatedData
            if (!isMessengerKey(type)) return next(ApiError.badRequest('Invalid messenger type'))

            const messenger = await this.messengerManagementService.fetchMessenger(type, messenger_id)
            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    }
    public fetchMessengersList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            ensureRequiredFields([user_id])

            const messengers = await this.messengerManagementService.fetchMessengersList(user_id)
            res.json(messengers)
        } catch (e) {
            return next(e)
        }
    };
    public deleteChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params

            const validatedData = validateQueryParams(req.query, ['recipient_id'])
            ensureRequiredFields([user_id])
            const {recipient_id} = validatedData

            await this.messengerManagementService.deleteChat(user_id, recipient_id)
            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    public postMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                user_id,
                messenger_name,
                messenger_desc,
                messenger_type,
                messenger_members
            } = req.body

            if (!isMessengerKey(messenger_type)) return next(ApiError.badRequest('Invalid messenger type'))
            ensureRequiredFields([user_id, messenger_name])

            const messenger = await this.messengerManagementService.postMessenger(
                user_id,
                messenger_name,
                messenger_desc,
                messenger_type,
                messenger_members,
                req.files
            )

            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    };
    public deleteMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = validateQueryParams(req.query, ['messenger_id'])
            const {messenger_id} = validatedData

            await this.messengerManagementService.deleteMessenger(messenger_id)
            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    public getReactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.query
            if (typeof messenger_id !== "undefined" && typeof messenger_id !== "string") {
                return next(ApiError.badRequest('Missing required fields'))
            }

            const reactions = await this.messengerManagementService.getReactions(messenger_id)
            res.json(reactions)
        } catch (e) {
            return next(e)
        }
    };
    public fetchNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            return next(e)
        }

        const {user_id} = req.params
        ensureRequiredFields([user_id])

        const {messengers} = req.body

        const notifications = await this.messengerManagementService.fetchNotifications(messengers, user_id)
        res.json(notifications)
    };
}

export default MessengerManagementController