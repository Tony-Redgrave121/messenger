import {UploadedFile} from "express-fileupload";

export default interface IMessengerFiles {
    messenger_image?: UploadedFile
}