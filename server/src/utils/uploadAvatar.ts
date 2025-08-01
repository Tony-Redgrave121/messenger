import {UploadedFile} from "express-fileupload";
import getImageExtension from "./getImageExtension";
import ApiError from "../errors/apiError";
import {resizeImage} from "./resizeImage";
import uploadFile from "./uploadFile";

const uploadAvatar = async (folder: string, file?: UploadedFile | null): Promise<string | null> => {
    if (!file) return null

    const {isImage, extension} = getImageExtension(file)
    if (!extension || !isImage) throw ApiError.badRequest('The file extension is missing or the file is not an image');

    const resizedBuffer = await resizeImage(file.data, 500, 500, extension as 'jpeg' | 'png' | 'webp' | 'jpg');
    const resizedFile: UploadedFile = {
        ...file,
        data: resizedBuffer,
        size: resizedBuffer.length,
    };

    const uploadResult = await uploadFile(folder, resizedFile, 'media')
    if (!uploadResult || uploadResult instanceof ApiError) {
        throw ApiError.badRequest("Failed to upload avatar")
    }

    return uploadResult.file || null
}

export default uploadAvatar;