import ApiError from "../errors/apiError"
import uploadFile from "./uploadFile"
import {UploadedFile} from "express-fileupload"
import deleteLocalFiles from "./deleteLocalFiles";

const changeOldImage = async (
    oldImageName: string | undefined,
    folder: string,
    newImage: UploadedFile
) => {
    if (oldImageName) await deleteLocalFiles([folder, oldImageName], {force: true})

    const uploadedImage = await uploadFile(folder, newImage, 'media')
    if (uploadedImage instanceof ApiError) {
        return ApiError.badRequest(`Error occurred while uploading new image`)
    }

    return uploadedImage
}

export default changeOldImage