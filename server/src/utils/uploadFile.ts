import * as uuid from "uuid"
import * as path from "path"
import * as fs from "fs"
import sharp from "sharp"
import ApiError from "../errors/apiError"
import {UploadedFile} from 'express-fileupload'
import FileKeys from "../types/keys/FileKeys";

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp'] as const

const uploadFile = async (folder: string, file: UploadedFile, type: FileKeys) => {
    try {
        const extension = path.extname(file.name).toLowerCase().replace('.', '')
        const isImage = IMAGE_TYPES.includes(extension as typeof IMAGE_TYPES[number])

        if (!extension) return ApiError.badRequest('File extension is missing')

        const fileName = `${uuid.v4()}.${file.name}`
        const folderPath = path.join(__dirname, '../../static', folder)
        const outputPath = path.join(folderPath, fileName)

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})

        if (type !== 'document' && isImage) {
            await sharp(file.data)
                .toFormat(extension as 'jpeg' | 'png' | 'webp')
                .jpeg({quality: 70})
                .toFile(outputPath)
        } else {
            await file.mv(outputPath)
        }

        return {
            file: fileName,
            size: file.size
        }
    } catch (e) {
        return ApiError.internalServerError('An errors occurred while uploading the file')
    }
}

export default uploadFile