import ApiError from "../error/ApiError"
import {NextFunction, Request, Response} from "express"
import SearchService from "../service/searchService";

class SearchController {
    async getMessengers(req: Request, res: Response, next: NextFunction) {
        try {
            const {query, type} = req.query

            if (!query || !type || typeof query !== 'string' || typeof type !== 'string')
                return next(ApiError.internalServerError('An error occurred while fetching messengers'))

            const messengers = await SearchService.getMessengers(query, type)

            res.json(messengers)
        } catch (e) {
            return next(ApiError.internalServerError("An error occurred while posting the messenger"))
        }
    }
}

export default new SearchController()