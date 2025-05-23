import ApiError from "../error/ApiError"
import {Request, Response} from "express"
import MessengerService from "../service/messengerService";

class MessengerController {
    async getContacts(req: Request, res: Response): Promise<any> {
        try {
            const {id} = req.params

            if (!id) return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))
            const contacts = await MessengerService.fetchContacts(id)

            return res.json(contacts)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching contacts"))
        }
    }
    async postMessenger(req: Request, res: Response): Promise<any> {
        try {
            const {user_id, messenger_name, messenger_desc, messenger_type, messenger_members} = req.body

            if (!user_id || !messenger_name || !messenger_type)
                return res.json(ApiError.internalServerError('An error occurred while posting the messenger'))

            const messenger = await MessengerService.postMessenger(user_id, messenger_name, messenger_desc, messenger_type, messenger_members, req.files)

            return res.json(messenger)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while posting the messenger"))
        }
    }
    async getMessengerSettings(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params

            if (!messenger_id)
                return res.json(ApiError.internalServerError('An error occurred while fetching the messenger settings'))

            const messengerSettings = await MessengerService.fetchMessengerSettings(messenger_id)

            return res.json(messengerSettings)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messenger settings"))
        }
    }
    async getReactions(req: Request, res: Response): Promise<any> {
        try {
            const reactions = await MessengerService.fetchReactions()

            return res.json(reactions)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching a reactions"))
        }
    }
    async putMessengerType(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params
            const messenger_type = req.body.messenger_type

            if (!messenger_id || !messenger_type)
                return res.json(ApiError.internalServerError('An error occurred while updating the messenger type'))

            const updateRes = await MessengerService.updateMessengerType(messenger_id, messenger_type)

            return res.json(updateRes)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating the messenger type"))
        }
    }
    async putMessengerLink(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params

            if (!messenger_id)
                return res.json(ApiError.internalServerError('An error occurred while updating the messenger link'))

            const updateRes = await MessengerService.updateMessengerLink(messenger_id)

            return res.json(updateRes)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating the messenger link"))
        }
    }
    async postMessengerReactions(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_setting_id} = req.params
            const reactions = req.body.reactions

            if (!messenger_setting_id)
                return res.json(ApiError.internalServerError('An error occurred while updating the messenger type'))

            const newReactions =await MessengerService.postMessengerReactions(messenger_setting_id, reactions)

            return res.json(newReactions)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating the messenger type"))
        }
    }
    async putMessengerModerators(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params
            const {member_status, user_id} = req.body

            if (!messenger_id || !member_status || !user_id)
                return res.json(ApiError.internalServerError('An error occurred while updating a messenger moderators'))

            const moderators = await MessengerService.updateMessengerModerators(member_status, user_id, messenger_id)

            return res.json(moderators)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating a messenger moderators"))
        }
    }
    async postContactsMembers(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params
            const members = req.body.members

            if (!messenger_id || !members)
                return res.json(ApiError.internalServerError('An error occurred while adding a new members'))

            const newMembers = await MessengerService.addContactsMembers(members, messenger_id)

            return res.json(newMembers)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while adding a new members"))
        }
    }
    async postMember(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params
            const user_id = req.body.user_id

            if (!messenger_id || !user_id)
                return res.json(ApiError.internalServerError('An error occurred while adding a new member'))

            const newMember = await MessengerService.addMember(user_id, messenger_id)

            return res.json(newMember)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while adding a new member"))
        }
    }
    async postRemoved(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id} = req.params
            const user_id = req.body.user_id

            if (!messenger_id || !user_id)
                return res.json(ApiError.internalServerError('An error occurred while removing a members'))

            const newRemoved = await MessengerService.postRemoved(user_id, messenger_id)

            return res.json(newRemoved)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while removing a members"))
        }
    }
    async deleteRemoved(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id, user_id} = req.params

            if (!messenger_id || !user_id)
                return res.json(ApiError.internalServerError('An error occurred while deleting a member from removed'))

            await MessengerService.deleteRemoved(user_id, messenger_id)

            return res.sendStatus(200)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while deleting a member from removed"))
        }
    }
    async deleteMember(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id, user_id} = req.params

            if (!messenger_id || !user_id)
                return res.json(ApiError.internalServerError('An error occurred while deleting a member from group'))

            await MessengerService.deleteMember(user_id, messenger_id)

            return res.sendStatus(200)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while deleting a member from group"))
        }
    }
    async putMessenger(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id, messenger_name, messenger_desc} = req.body

            if (!messenger_id || !messenger_name)
                return res.json(ApiError.internalServerError('An error occurred while updating the messenger'))

            const messenger = await MessengerService.putMessenger(messenger_id, messenger_name, messenger_desc, req.files)

            return res.json(messenger)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while updating the messenger"))
        }
    }
    async getComments(req: Request, res: Response): Promise<any> {
        try {
            const {messenger_id, messenger_name, messenger_desc} = req.body

            if (!messenger_id || !messenger_name)
                return res.json(ApiError.internalServerError('An error occurred while posting a comment'))

            const messenger = await MessengerService.putMessenger(messenger_id, messenger_name, messenger_desc, req.files)

            return res.json(messenger)
        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while posting a comment"))
        }
    }
}

export default new MessengerController()