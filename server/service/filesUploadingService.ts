import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";
import ApiError from "../error/ApiError.js";
import { UploadedFile } from 'express-fileupload'

export default function filesUploadingService(folder: string, file: UploadedFile) {
    try {
        const fileExt = file.name.split('.').pop()!.toLowerCase()
        const resFile = uuid.v4() + "." + fileExt
        const folderPath = path.join(__dirname + "/../src/static", folder)

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})

        file.mv(path.resolve(folderPath, resFile))
        return {file: resFile, size: file.size}
    } catch (e) {
        return ApiError.internalServerError('An error occurred while uploading the file')
    }
}