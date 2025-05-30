import path from "path";
import fs from "fs";
import ApiError from "../error/ApiError";
import filesUploadingService from "../service/filesUploadingService";
import {UploadedFile} from "express-fileupload";

const changeOldImage = async (oldImageName: string | undefined, folder: string, newImage: UploadedFile) => {
    if (oldImageName) {
        try {
            const filePath = path.join(__dirname + "/../src/static", folder, oldImageName)

            await fs.promises.rm(filePath, {force: true})
        } catch (error) {
            throw ApiError.badRequest(`Error with image deleting`)
        }
    }

    const image = await filesUploadingService(folder, newImage, 'media')
    if (image instanceof ApiError) throw ApiError.badRequest(`Error with image creation`)

    return image
}

export default changeOldImage