import ApiError from "../error/ApiError"
import {Request, Response} from "express"
import MessengerService from "../service/messengerService";

class MessengerController {
    async fetchContacts(req: Request, res: Response): Promise<any> {
        try {

        } catch (e) {
            return res.json(ApiError.internalServerError("An error occurred while fetching a contacts"))
        }
        const {id} = req.params

        if (!id) return res.json(ApiError.internalServerError('An error occurred while fetching the messenger'))
        const contacts = await MessengerService.fetchContacts(id)

        if (contacts instanceof ApiError) return res.json(ApiError.internalServerError('An error occurred while fetching a contacts'))

        return res.json(contacts)
    }
}

export default new MessengerController()