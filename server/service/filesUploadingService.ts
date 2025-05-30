import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";
import sharp from "sharp"
import ApiError from "../error/ApiError.js";
import { UploadedFile } from 'express-fileupload'

const imageTypes = ['jpg', 'jpeg', 'png', 'webp']

export default async function filesUploadingService(folder: string, file: UploadedFile, type: string) {
    try {
        const fileExt = file.name.split('.').pop()!.toLowerCase()
        const fileName = `${uuid.v4()}.${file.name}`
        const folderPath = path.join(__dirname + "/../src/static", folder)
        const outputPath = path.resolve(folderPath, fileName)

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})

        if (type !== 'document' && imageTypes.includes(fileExt)) {
            await sharp(file.data)
                .toFormat(fileExt as 'jpeg' | 'png' | 'webp')
                .jpeg({ quality: 70 })
                .toFile(outputPath)
        } else await file.mv(outputPath)

        return {
            file: fileName,
            size: file.size
        }
    } catch (e) {
        return  ApiError.internalServerError('An error occurred while uploading the file')
    }
}