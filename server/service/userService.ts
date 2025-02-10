import ApiError from "../error/ApiError"
import models from "../model/models"
import {FileArray} from "express-fileupload";

interface IPostMessage {
    user_id: string,
    messenger_id: string,
    reply_id: string,
    message_text: string,
    message_type: string
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
            where: {user_id: user_id, messenger_id: messenger_id},
            include: [
                {model: models.message_file, attributes: ['message_file_id', 'message_file_name', 'message_file_size']},
                {model: models.users, attributes: ['user_name']},
                {
                    model: models.message,
                    as: 'reply',
                    attributes: ['message_text'],
                    include: [{model: models.users, attributes: ['user_name']}]
                }
            ],
            order: [['message_date', 'DESC']]
        })

        if (!messages) return ApiError.internalServerError("An error occurred while fetching the messages")

        return messages
    }

    async postMessage(message: IPostMessage, files: FileArray | null | undefined) {

        const messenger = await models.messenger.findOne({
            include: [{
                model: models.member,
                where: {user_id: message}
            }]
        })
        if (!messenger) return ApiError.internalServerError("An error occurred while fetching the messenger")

        return messenger
    }
}

export default new UserService()