import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import SearchService from "../service/searchService";
import validateQueryParams from "../shared/validation/validateQueryParams";

class SearchController {
    constructor(private readonly searchService: SearchService) {}

    async getMessengers(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validateQueryParams(req.query, ['query', 'type'])
            if (validatedData instanceof ApiError) return next(validatedData)

            const {query, type} = validatedData

            const messengers = await this.searchService.getMessengers(query, type)
            res.json(messengers)
        } catch (e) {
            return next(e)
        }
    }
    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validateQueryParams(req.query, ['query', 'type', 'user_id', 'messenger_id'])
            if (validatedData instanceof ApiError) return next(validatedData)

            const {query, type, user_id, messenger_id} = validatedData
            const {post_id} = req.query

            if (typeof post_id !== "undefined" && typeof post_id !== "string") {
                return next(ApiError.badRequest('Missing required fields'))
            }

            const messages = await this.searchService.getMessages(query, type, user_id, messenger_id, post_id)
            res.json(messages)
        } catch (e) {
            return next(e)
        }
    }
}

export default SearchController