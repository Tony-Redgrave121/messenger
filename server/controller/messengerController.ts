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

        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching the messenger settings"))
        }

        const {messenger_id} = req.params

        if (!messenger_id)
            return res.json(ApiError.internalServerError('An error occurred while fetching the messenger settings'))

        const messenger = await MessengerService.fetchMessengerSettings(messenger_id)

        return res.json(messenger)
    }
}

export default new MessengerController()