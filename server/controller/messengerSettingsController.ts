import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import isMessengerKey from "../types/typeGuards/isMessengerKey";
import ensureRequiredFields from "../shared/validation/ensureRequiredFields";
import MessengerSettingsService from "../service/messengerSettingsService";

class MessengerSettingsController {
    constructor(private readonly messengerSettingsService: MessengerSettingsService) {}

    public getMessengerSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            ensureRequiredFields([messenger_id])

            const messengerSettings = await this.messengerSettingsService.fetchMessengerSettings(messenger_id)
            res.json(messengerSettings)
        } catch (e) {
            return next(e)
        }
    };
    public putMessengerType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {messenger_type} = req.body

            if (!isMessengerKey(messenger_type)) return next(ApiError.badRequest('Invalid messenger type'))
            ensureRequiredFields([messenger_id])

            const messengerType = await this.messengerSettingsService.updateMessengerType(messenger_id, messenger_type)
            res.json(messengerType)
        } catch (e) {
            return next(e)
        }
    };
    public putMessengerLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            ensureRequiredFields([messenger_id])

            const messengerLink = await this.messengerSettingsService.updateMessengerLink(messenger_id)
            res.json(messengerLink)
        } catch (e) {
            return next(e)
        }
    };
    public postMessengerReactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_setting_id} = req.params
            const {reactions} = req.body
            ensureRequiredFields([messenger_setting_id])

            const newReactions = await this.messengerSettingsService.postMessengerReactions(messenger_setting_id, reactions)
            res.json(newReactions)
        } catch (e) {
            return next(e)
        }
    };
    public putMessengerModerators = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {member_status, user_id} = req.body
            ensureRequiredFields([messenger_id, member_status, user_id])

            const moderators = await this.messengerSettingsService.updateMessengerModerators(member_status, user_id, messenger_id)
            res.json(moderators)
        } catch (e) {
            return next(e)
        }
    };
    public postContactsMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {members} = req.body
            ensureRequiredFields([messenger_id, members])

            const newMembers = await this.messengerSettingsService.addContactsMembers(members, messenger_id)
            res.json(newMembers)
        } catch (e) {
            return next(e)
        }
    };
    public postMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {user_id} = req.body
            ensureRequiredFields([messenger_id, user_id])

            const newMember = await this.messengerSettingsService.addMember(user_id, messenger_id)
            res.json(newMember)
        } catch (e) {
            return next(e)
        }
    };
    public postRemoved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {user_id} = req.body
            ensureRequiredFields([messenger_id, user_id])

            const newRemoved = await this.messengerSettingsService.postRemoved(user_id, messenger_id)
            res.json(newRemoved)
        } catch (e) {
            return next(e)
        }
    };
    public putMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, messenger_name, messenger_desc} = req.body
            ensureRequiredFields([messenger_id, messenger_name])

            const messenger = await this.messengerSettingsService.putMessenger(messenger_id, messenger_name, messenger_desc, req.files)
            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    };
    public deleteRemoved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, user_id} = req.params
            ensureRequiredFields([messenger_id, user_id])

            await this.messengerSettingsService.deleteRemoved(user_id, messenger_id)
            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    public deleteMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, user_id} = req.params
            ensureRequiredFields([messenger_id, user_id])

            await this.messengerSettingsService.deleteMember(user_id, messenger_id)
            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
}

export default MessengerSettingsController