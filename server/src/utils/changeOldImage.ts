import ApiError from "../errors/apiError"
import uploadFile from "./uploadFile"
import {UploadedFile} from "express-fileupload"
import deleteLocalFiles from "./deleteLocalFiles";
import {resizeImage} from "./resizeImage";
import getImageExtension from "./getImageExtension";

const changeOldImage = async (
    oldImageName: string | undefined,
    folder: string,
    newImage: UploadedFile
) => {
    if (oldImageName) await deleteLocalFiles([folder, oldImageName], {force: true})

    const {isImage, extension} = getImageExtension(newImage)
    if (!extension || !isImage) throw ApiError.badRequest('The file extension is missing or the file is not an image');

    const resizedBuffer = await resizeImage(newImage.data, 500, 500, extension as 'jpeg' | 'jpg' | 'png' | 'webp');
    const resizedFile: UploadedFile = {
        ...newImage,
        data: resizedBuffer,
        size: resizedBuffer.length,
    };

    const uploadedImage = await uploadFile(folder, resizedFile, 'media')
    if (uploadedImage instanceof ApiError) {
        return ApiError.badRequest(`Error occurred while uploading new image`)
    }

    return uploadedImage
}

export default changeOldImage