import index from "../models";
import path from "path";
import fs from "fs";
import IFile from "../types/fileTypes/IFile";
import ApiError from "../errors/apiError";
import convertToPlain from "./convertToPlain";
import IMessageId from "../types/idTypes/IMessageId";

const deleteAllMessages = async (messages: IMessageId[]) => {
    if (messages.length === 0) return []
    const messageIds = messages.map(m => m.message_id)

    const messageFiles = await index.message_file.findAll({
        where: {message_id: messageIds},
        attributes: ['message_file_name', 'message_file_path'],
    })

    const messageFilesPlain = convertToPlain<IFile>(messageFiles)
    for (const {message_file_name, message_file_path} of messageFilesPlain) {
        try {
            const filePath = path.join(__dirname, "../../static/messengers", message_file_path, message_file_name)

            await fs.promises.unlink(filePath)
        } catch (e) {
            const eNode = e as NodeJS.ErrnoException

            if (eNode.code !== 'ENOENT') {
                return ApiError.internalServerError('Failed to delete file')
            }
        }
    }

    return messageIds
}

export default deleteAllMessages