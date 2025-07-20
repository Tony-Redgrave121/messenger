import fs from "fs";
import path from "path";
import sharp from "sharp";
import ApiError from "../errors/apiError";
import {Response} from "express";

class FileService {
    public getFile = async (filepath: string, filename: string, quality: number, res: Response) => {
        const originalPath = path.join(__dirname, '../../static/messengers', filepath, filename);

        if (!fs.existsSync(originalPath)) throw ApiError.notFound('File not found');

        const extension = path.extname(filename).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(extension);

        if (isImage) {
            return sharp(originalPath)
                .resize(quality < 100 ? { width: 400 } : undefined)
                .toFormat('jpeg')
                .jpeg({ quality })
                .pipe(res);
        } else {
            return fs.createReadStream(originalPath).pipe(res);
        }
    }
}

export default FileService