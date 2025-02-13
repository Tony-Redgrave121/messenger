import ApiError from "../error/ApiError"
import models from "../model/models"
import {FileArray} from "express-fileupload"
import * as uuid from "uuid"
import filesUploadingService from "./filesUploadingService"
import path from "path"
import fs from "fs"

interface IPostMessage {
    user_id: string,
    messenger_id: string,
    reply_id: string,
    message_text: string,
    message_type: string
}

interface IMessageFiles {
    message_file_id: string,
    message_file_name: string,
    message_file_size: number
}

class UserService {
    async fetchMessenger(user_id: string) {
        if (!user_id) return ApiError.internalServerError("An error occurred while fetching the messenger")

        const messenger = await models.messenger.findOne({
            include: [{
                model: models.member,
                where: {user_id: user_id}
            }]
        })
        if (!messenger) return ApiError.internalServerError("An error occurred while fetching the messenger")

        return messenger
    }

    async fetchMessengersList(user_id: string) {
        if (!user_id) return ApiError.internalServerError("An error occurred while fetching messengers list")

        const messengersList = await models.messenger.findAll({
            include: [
                {
                    model: models.member,
                    where: {user_id: user_id},
                    attributes: []
                },
                {
                    model: models.message,
                    limit: 1,
                    order: [['message_date', 'DESC']],
                    attributes: ['message_text', 'message_date']
                }
            ],
            attributes: ['messenger_id', 'messenger_name', 'messenger_image', 'messenger_type']
        })
        if (!messengersList) return ApiError.internalServerError("An error occurred while fetching messengers list")

        return messengersList
    }

    async fetchMessages(user_id: string, messenger_id: string) {
        if (!user_id) return ApiError.internalServerError("An error occurred while fetching the messages")

        const messages = await models.message.findAll({
            where: {messenger_id: messenger_id},
            include: [
                {model: models.message_file, attributes: ['message_file_id', 'message_file_name', 'message_file_size']},
                {model: models.users, attributes: ['user_id', 'user_name', 'user_img']},
                {
                    model: models.message,
                    as: 'reply',
                    attributes: ['message_id', 'message_text'],
                    include: [{model: models.users, attributes: ['user_id', 'user_name', 'user_img']}]
                }
            ],
            order: [['message_date', 'ASC']]
        })

        if (!messages) return ApiError.internalServerError("An error occurred while fetching the messages")

        return messages
    }

    async postMessage(message: IPostMessage, files: FileArray | null | undefined) {
        const message_id = uuid.v4()
        let message_files: IMessageFiles[] = []

        const messagePost = await models.message.create({
            message_id: message_id,
            message_text: message.message_text,
            message_type: message.message_type,
            reply_id: message.reply_id,
            user_id: message.user_id,
            messenger_id: message.messenger_id
        })

        if (files && files.message_files) {
            const fileArray = Array.isArray(files.message_files) ? files.message_files : [files.message_files]

            for (const file of fileArray) {
                const message_file_id = uuid.v4()

                const filesPost = filesUploadingService(`messengers/${message.messenger_id}`, file)

                if (filesPost instanceof ApiError || !filesPost) return ApiError.badRequest(`Error with files uploading`)

                const message_file = await models.message_file.create({
                    message_file_id: message_file_id,
                    message_file_name: filesPost.file,
                    message_file_size: filesPost.size,
                    message_id: message_id
                })

                message_files.push(message_file.dataValues)
            }
        }

        const reply = await models.message.findOne({
            where: [{message_id: message.reply_id}],
            include: [{
                model: models.users,
                as: 'user',
                attributes: ['user_id', 'user_name', 'user_img']
            }],
            attributes: ['message_id', 'message_text']
        })

        const user = await models.users.findOne({
            where: [{user_id: message.user_id}],
            attributes: ['user_id', 'user_name', 'user_img']
        })

        return {
            ...messagePost.dataValues,
            message_files: message_files,
            reply: reply,
            user: user
        }
    }

    async deleteMessage(message_id: string, messenger_id: string) {
        try {
            const message_files = await models.message_file.findAll({
                where: {message_id: message_id},
                attributes: ['message_file_name'],
                raw: true
            }) as unknown as { message_file_name: string }[]

            for (const file of message_files) {
                const filePath = path.resolve(__dirname + "/../src/static/messengers", messenger_id, file.message_file_name)

                if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
            }

            await models.message.destroy({where: {message_id: message_id}})
        } catch (e) {
            console.log(e)
        }
    }
}

export default new UserService()