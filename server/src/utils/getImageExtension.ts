import {UploadedFile} from "express-fileupload";
import path from "path";

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp'] as const

const getImageExtension = (file: UploadedFile) => {
    const extension = path.extname(file.name).toLowerCase().replace('.', '') ;
    const isImage = IMAGE_TYPES.includes(extension as typeof IMAGE_TYPES[number]);

    return {
        extension,
        isImage,
    }
}

export default getImageExtension;