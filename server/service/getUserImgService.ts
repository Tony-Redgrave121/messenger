import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";
import ApiError from "../error/ApiError.js";
import { UploadedFile } from 'express-fileupload'

export default function getUserImgService(folder: string, file: UploadedFile, fileName: string) {
    try {
        const fileExtension = fileName.split('.').pop()!.toLowerCase()
        const resFile = uuid.v4() + "." + fileExtension
        const folderPath = path.resolve(__dirname + "/../src/static/users", folder)

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})
        else return ApiError.internalServerError('An error occurred while fetching the user')

        file.mv(path.resolve(folderPath, resFile))
        return resFile
    } catch (e) {
        return ApiError.internalServerError('An error occurred while fetching the user')
    }
}