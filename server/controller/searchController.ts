import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import SearchService from "../service/searchService";

class SearchController {
    async getMessengers(req: Request, res: Response, next: NextFunction) {
        try {
            const {query, type} = req.query

            if (
                !query ||
                !type ||
                typeof query !== 'string' ||
                typeof type !== 'string'
            ) return next(ApiError.internalServerError('An error occurred while fetching messengers'))

            const messengers = await SearchService.getMessengers(query, type)

            res.json(messengers)
        } catch (e) {
            return next(ApiError.internalServerError("An error occurred while fetching messengers"))
        }
    }
    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {
            return next(ApiError.internalServerError("An error occurred while fetching messages"))
        }
        const {query, type, user_id, messenger_id, post_id} = req.query

        if (
            !query ||
            !type ||
            typeof query !== 'string' ||
            typeof type !== 'string' ||
            !user_id ||
            !messenger_id ||
            typeof user_id !== 'string' ||
            typeof messenger_id !== 'string'
        ) return next(ApiError.internalServerError('An error occurred while fetching messages'))

        if (typeof post_id === 'string' || typeof post_id === 'undefined') {
            const messages = await SearchService.getMessages(query, type, user_id, messenger_id, post_id)

            res.json(messages)
        } else {
            return next(ApiError.internalServerError("An error occurred while fetching messages"))
        }
    }
}

export default new SearchController()