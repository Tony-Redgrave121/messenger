import ApiError from "../error/ApiError"
import models from "../model/models"
import {FileArray} from "express-fileupload"
import * as uuid from "uuid"
import uploadFile from "../shared/uploadFile"
import path from "path"
import fs from "fs"
import {Op, Sequelize} from "sequelize";
import IMessagesResponse from "../types/IMessagesResponse";
import findAllMessagesQuery from "../shared/sequelizeQueries/findAllMessagesQuery";
import normalizeMessage from "../shared/normalizeMessage";
import convertToPlain from "../shared/convertToPlain";

interface IPostMessage {
    user_id: string,
    messenger_id: string | null,
    reply_id: string,
    post_id?: string,
    message_text: string,
    message_type: 'media' | 'document',
    recipient_user_id: string | null,
}

interface IMessageFiles {
    message_file_id: string,
    message_file_name: string,
    message_file_size: number
}

interface IMessageId {
    message_id: string
}

interface ICommentFile {
    message_file_name: string,
    message_file_path: string
}

class UserService {
    public async fetchMessages(type: string, user_id: string, messenger_id: string, post_id?: string) {
        const whereBase = type !== "chat" ?
            {
                messenger_id: messenger_id,
                parent_post_id: post_id ?? null
            } : {recipient_user_id: [messenger_id, user_id]}

        const messages = await models.message.findAll({
            where: whereBase,
            ...findAllMessagesQuery,
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.parent_post_id")), "comments_count"]]
            },
            order: [['message_date', 'ASC']],
        })

        const messagesPlain = convertToPlain<IMessagesResponse>(messages)
        return await Promise.all(
            messagesPlain.map(async m => normalizeMessage(m))
        )
    }

    public async fetchMessage(message_id: string, messenger_id: string) {
        const message = await models.message.findOne({
            where: {
                messenger_id: messenger_id,
                message_id: message_id
            },
            ...findAllMessagesQuery,
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.parent_post_id")), "comments_count"]]
            },
            order: [['message_date', 'ASC']],
        })

        if (!message) throw ApiError.internalServerError("Message not found")
        const messagePlain = convertToPlain<IMessagesResponse>(message)

        return normalizeMessage(messagePlain)
    }

    public async postMessage(message: IPostMessage, files: FileArray | null | undefined) {
        const message_id = uuid.v4()
        let message_files: IMessageFiles[] = []

        const messagePost = await models.message.create({
            message_id,
            message_text: message.message_text,
            message_type: message.message_type,
            reply_id: message.reply_id,
            parent_post_id: message.post_id,
            user_id: message.user_id,
            messenger_id: message.messenger_id,
            recipient_user_id: message.recipient_user_id
        })

        if (files?.message_files) {
            const fileArray = Array.isArray(files.message_files) ? files.message_files : [files.message_files]

            for (const file of fileArray) {
                const message_file_id = uuid.v4()
                const folder = message.messenger_id ?? message.recipient_user_id;

                if (!folder) {
                    throw ApiError.badRequest('Missing folder identifier for file upload');
                }

                const filesPost = await uploadFile(`messengers/${folder}`, file, message.message_type)

                if (filesPost instanceof ApiError) {
                    throw ApiError.internalServerError(`Error with files uploading`)
                }

                const message_file = await models.message_file.create({
                    message_file_id,
                    message_file_name: filesPost.file,
                    message_file_size: filesPost.size,
                    message_id,
                    message_file_path: folder
                })

                message_files.push(message_file.dataValues)
            }
        }

        const reply = message.reply_id ? await models.message.findOne({
            where: [{message_id: message.reply_id}],
            include: [{
                model: models.users,
                as: 'user',
                attributes: ['user_id', 'user_name', 'user_img']
            }],
            attributes: ['message_id', 'message_text']
        }) : null

        const user = await models.users.findOne({
            where: [{user_id: message.user_id}],
            attributes: ['user_id', 'user_name', 'user_img']
        })

        if (!user) {
            throw ApiError.internalServerError(`User not found`)
        }

        return {
            ...messagePost.dataValues,
            message_files,
            reply,
            user
        }
    }

    public async deleteMessage(message_id: string) {
        const comments = await models.message.findAll({
            where: {parent_post_id: message_id},
            attributes: ['message_id'],
        })

        const commentsPlain = convertToPlain<IMessageId>(comments) ?? []
        const messageIdsToDelete = commentsPlain?.map(m => m.message_id) || []
        messageIdsToDelete.push(message_id)

        const messageFiles = await models.message_file.findAll({
            where: {message_id: messageIdsToDelete},
            attributes: ['message_file_name', 'message_file_path'],
        })

        const filesPlain = convertToPlain<ICommentFile>(messageFiles) ?? []
        for (const file of filesPlain) {
            const filePath = path.resolve(__dirname + "/../src/static/messengers", file.message_file_path, file.message_file_name)

            try {
                if (fs.existsSync(filePath)) await fs.promises.unlink(filePath)
            } catch (err) {
                return ApiError.internalServerError("Error deleting file")
            }
        }

        await models.message.destroy(
            {
                where: {
                    [Op.or]: [
                        {message_id: message_id},
                        ...(messageIdsToDelete ? [{parent_post_id: message_id}] : [])
                    ]
                }
            }
        )
    }

    public async postMessageReaction(message_id: string, user_id: string, reaction_id: string) {
        const reactionExists = await models.message_reactions.findOne({
            where: {message_id, user_id, reaction_id}
        })

        if (reactionExists) {
            throw ApiError.badRequest('Reaction already exists for this message and user')
        }

        await models.message_reactions.create({
            message_reaction_id: uuid.v4(),
            message_id,
            user_id,
            reaction_id,
        })

        const reaction = await models.reactions.findOne({where: {reaction_id}})
        if (!reaction) throw ApiError.internalServerError('Reaction type not found')

        return reaction
    }

    public async deleteMessageReaction(message_id: string, user_id: string, reaction_id: string) {
        await models.message_reactions.destroy({
            where: {
                message_id: message_id,
                user_id: user_id,
                reaction_id: reaction_id
            }
        })
    }
}

export default UserService