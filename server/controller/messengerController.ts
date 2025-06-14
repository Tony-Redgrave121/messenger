import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import MessengerService from "../service/messengerService";

class MessengerController {
    getContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params

            if (!user_id) return next(ApiError.internalServerError('An error occurred while fetching contacts'))
            const contacts = await MessengerService.fetchContacts(user_id)

            res.json(contacts)
        } catch (e) {
            return next(e)
        }
    };
    postContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const contact_id = req.body.contact_id

            if (!user_id || !contact_id) return next(ApiError.internalServerError('An error occurred while posting a contact'))
            const contact = await MessengerService.postContact(user_id, contact_id)

            res.json(contact)
        } catch (e) {
            return next(e)
        }
    };
    deleteContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {contact_id} = req.query

            if (
                !user_id ||
                !contact_id ||
                typeof contact_id !== 'string'
            ) return next(ApiError.internalServerError('An error occurred while posting a contact'))

            await MessengerService.deleteContact(user_id, contact_id)

            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    deleteChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id} = req.params
            const {recipient_id} = req.query

            if (
                !user_id ||
                !recipient_id ||
                typeof recipient_id !== 'string'
            ) return next(ApiError.internalServerError('An error occurred while deleting a chat'))

            await MessengerService.deleteChat(user_id, recipient_id)

            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    postMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id, messenger_name, messenger_desc, messenger_type, messenger_members} = req.body

            if (!user_id || !messenger_name || !messenger_type)
                return next(ApiError.internalServerError('An error occurred while posting the messenger'))

            const messenger = await MessengerService.postMessenger(user_id, messenger_name, messenger_desc, messenger_type, messenger_members, req.files)

            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    };
    deleteMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.query

            if (!messenger_id || typeof messenger_id !== 'string')
                return next(ApiError.internalServerError('An error occurred while deleting a messenger'))

            await MessengerService.deleteMessenger(messenger_id)

            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    getMessengerSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params

            if (!messenger_id)
                return next(ApiError.internalServerError('An error occurred while fetching the messenger settings'))

            const messengerSettings = await MessengerService.fetchMessengerSettings(messenger_id)

            res.json(messengerSettings)
        } catch (e) {
            return next(e)
        }
    };
    getReactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.query

            if (typeof messenger_id === 'string' || typeof messenger_id === 'undefined') {
                const reactions = await MessengerService.getReactions(messenger_id)

                res.json(reactions)
            } else {
                return next(ApiError.internalServerError("An error occurred while fetching reactions"))
            }
        } catch (e) {
            return next(e)
        }
    };
    putMessengerType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const messenger_type = req.body.messenger_type

            if (!messenger_id || !messenger_type)
                return next(ApiError.internalServerError('An error occurred while updating the messenger type'))

            const updateRes = await MessengerService.updateMessengerType(messenger_id, messenger_type)

            res.json(updateRes)
        } catch (e) {
            return next(e)
        }
    };
    putMessengerLink = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            return next(e)
        }

        const {messenger_id} = req.params

        if (!messenger_id)
            return next(ApiError.internalServerError('An error occurred while updating the messenger link'))

        const updateRes = await MessengerService.updateMessengerLink(messenger_id)

        res.json(updateRes)
    };
    postMessengerReactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_setting_id} = req.params
            const reactions = req.body.reactions

            if (!messenger_setting_id)
                return next(ApiError.internalServerError('An error occurred while updating the messenger type'))

            const newReactions =await MessengerService.postMessengerReactions(messenger_setting_id, reactions)

            res.json(newReactions)
        } catch (e) {
            return next(e)
        }
    };
    putMessengerModerators = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const {member_status, user_id} = req.body

            if (!messenger_id || !member_status || !user_id)
                return next(ApiError.internalServerError('An error occurred while updating a messenger moderators'))

            const moderators = await MessengerService.updateMessengerModerators(member_status, user_id, messenger_id)

            res.json(moderators)
        } catch (e) {
            return next(e)
        }
    };
    postContactsMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const members = req.body.members

            if (!messenger_id || !members)
                return next(ApiError.internalServerError('An error occurred while adding a new members'))

            const newMembers = await MessengerService.addContactsMembers(members, messenger_id)

            res.json(newMembers)
        } catch (e) {
            return next(e)
        }
    };
    postMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const user_id = req.body.user_id

            if (!messenger_id || !user_id)
                return next(ApiError.internalServerError('An error occurred while adding a new member'))

            const newMember = await MessengerService.addMember(user_id, messenger_id)

            res.json(newMember)
        } catch (e) {
            return next(e)
        }
    };
    postRemoved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id} = req.params
            const user_id = req.body.user_id

            if (!messenger_id || !user_id)
                return next(ApiError.internalServerError('An error occurred while removing a members'))

            const newRemoved = await MessengerService.postRemoved(user_id, messenger_id)

            res.json(newRemoved)
        } catch (e) {
            return next(e)
        }
    };
    deleteRemoved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, user_id} = req.params

            if (!messenger_id || !user_id)
                return next(ApiError.internalServerError('An error occurred while deleting a member from removed'))

            await MessengerService.deleteRemoved(user_id, messenger_id)

            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    deleteMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, user_id} = req.params

            if (!messenger_id || !user_id)
                return next(ApiError.internalServerError('An error occurred while deleting a member from group'))

            await MessengerService.deleteMember(user_id, messenger_id)

            res.sendStatus(200)
        } catch (e) {
            return next(e)
        }
    };
    putMessenger = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {messenger_id, messenger_name, messenger_desc} = req.body

            if (!messenger_id || !messenger_name)
                return next(ApiError.internalServerError('An error occurred while updating the messenger'))

            const messenger = await MessengerService.putMessenger(messenger_id, messenger_name, messenger_desc, req.files)

            res.json(messenger)
        } catch (e) {
            return next(e)
        }
    };
    postMessageReaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id} = req.params
            const {reaction_id, user_id} = req.body

            if (!message_id || !reaction_id || !user_id)
                return next(ApiError.internalServerError('An error occurred while posting a reaction'))

            const reaction = await MessengerService.postMessageReaction(message_id, user_id, reaction_id)

            res.json(reaction)
        } catch (e) {
            return next(e)
        }
    };
    deleteMessageReaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {message_id} = req.params
            const {reaction_id, user_id} = req.query

            if (
                !message_id ||
                !reaction_id ||
                !user_id ||
                typeof reaction_id !== 'string' ||
                typeof user_id !== 'string'
            ) return next(ApiError.internalServerError('An error occurred while deleting a reaction'))

            const reaction = await MessengerService.deleteMessageReaction(message_id, user_id, reaction_id)

            res.json(reaction)
        } catch (e) {
            return next(e)
        }
    };
}

export default new MessengerController()