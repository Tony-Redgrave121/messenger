import {UploadedFile} from "express-fileupload";

export default interface IUserFiles {
    user_img?: UploadedFile
}