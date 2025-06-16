import models from "../model/models";
import path from "path";
import fs from "fs";
import IFile from "../types/IFile";
import ApiError from "../error/ApiError";
import convertToPlain from "./convertToPlain";

interface IMessage {
    message_id: string
}

const deleteAllMessages = async (messages: IMessage[]) => {
    if (messages.length === 0) return []
    const messageIds = messages.map(m => m.message_id)

    const messageFiles = await models.message_file.findAll({
        where: {message_id: messageIds},
        attributes: ['message_file_name', 'message_file_path'],
    })

    const messageFilesPlain = convertToPlain<IFile>(messageFiles)
    for (const {message_file_name, message_file_path} of messageFilesPlain) {
        try {
            const filePath = path.resolve(__dirname, "../src/static/messengers", message_file_path, message_file_name)
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