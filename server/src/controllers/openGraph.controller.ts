import {NextFunction, Request, Response} from "express"
import OpenGraphService from "../services/openGraph.service";
import ApiError from "../errors/apiError";

class OpenGraphController {
    constructor(private readonly openGraphService: OpenGraphService) {}

    public getMetaData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { url } = req.query;

            if (typeof url !== "string") {
                return next(ApiError.badRequest('Missing required fields'))
            }

            const result = await this.openGraphService.getMetaData(url)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}

export default OpenGraphController