import {NextFunction, Request, Response} from "express"
import ensureRequiredFields from "../utils/validation/ensureRequiredFields";
import FileService from "../services/file.service";
import mime from "mime";

class FileController {
    constructor(private readonly fileService: FileService) {}

    public getFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {filepath, filename} = req.params
            const quality = req.query.quality === 'low' ? 85 : 100

            ensureRequiredFields([filepath, filename])

            const mimeType = mime.lookup(filename) || 'application/octet-stream';
            res.setHeader('Content-Type', mimeType);

            await this.fileService.getFile(filepath, filename, quality, res)
        } catch (e) {
            next(e)
        }
    }
}

export default FileController