import ApiError from "../error/ApiError"
import models from "../model/models"
import {FileArray, UploadedFile} from "express-fileupload"
import * as uuid from "uuid"
import filesUploadingService from "./filesUploadingService"
import path from "path"
import fs from "fs"
import {Op, Sequelize} from "sequelize";
import IProfileSettings from "../types/IProfileSettings";
import IUser from "../types/IUser";
import changeOldImage from "../lib/changeOldImage";
import bcrypt from "bcrypt";
import IMessagesResponse from "../types/IMessagesResponse";
import IReaction from "../types/IReaction";

interface IPostMessage {
    user_id: string,
    messenger_id: string | null,
    reply_id: string,
    post_id?: string,
    message_text: string,
    message_type: string,
    recipient_user_id: string | null,
}

interface IMessageFiles {
    message_file_id: string,
    message_file_name: string,
    message_file_size: number
}

interface IUserFiles {
    user_img?: UploadedFile
}

class UserService {
    async fetchMessenger(type: string, user_id: string, messenger_id: string) {
        let messenger

        if (type === "chat") {
            messenger = await models.users.findOne({
                attributes: ['user_id', 'user_name', 'user_img', 'user_bio', 'user_last_seen'],
                where: {user_id: messenger_id}
            })
        } else {
            messenger = await models.messenger.findOne({
                include: [
                    {
                        model: models.members,
                        attributes: []
                    },
                    {
                        model: models.members,
                        as: "user_member",
                        include: [
                            {
                                model: models.users,
                                attributes: ['user_id', 'user_name', 'user_img', 'user_bio', 'user_last_seen'],
                            }
                        ]
                    }
                ],
                attributes: {
                    include: [[Sequelize.fn("COUNT", Sequelize.col("members.member_id")), "members_count"]]
                },
                where: {messenger_id: messenger_id},
                group: [
                    'messenger.messenger_id',
                    'user_member.member_id',
                    'user_member.user.user_id',
                    'user_member.user.user_name',
                    'user_member.user.user_img',
                    'user_member.user.user_bio',
                    'user_member.user.user_last_seen'
                ]
            })
        }

        if (!messenger) return ApiError.internalServerError("An error occurred while fetching the messenger")

        return messenger
    }

    async fetchMessengersList(user_id: string) {
        if (!user_id) return ApiError.internalServerError("An error occurred while fetching messengers list")
        const messages = await models.message.findAll({
            where: {
                [Op.or]: [
                    {user_id},
                    {recipient_user_id: user_id}
                ]
            },
            attributes: ['user_id', 'recipient_user_id'],
            raw: true,
        }) as unknown as {
            user_id: string,
            recipient_user_id: string | null,
        }[]

        const privatesIds = new Set<string>()

        messages.forEach(msg => {
            if (msg.user_id === user_id && msg.recipient_user_id) privatesIds.add(msg.recipient_user_id)
            else if (msg.recipient_user_id === user_id) privatesIds.add(msg.user_id)
        })

        const companionUsers = await models.users.findAll({
            where: {user_id: Array.from(privatesIds)},
            attributes: ['user_id', 'user_name', 'user_img']
        }) as unknown as {
            user_id: string,
            user_name: string,
            user_img?: string,
        }[]

        const lastMessages = await Promise.all(
            companionUsers.map(async (companion) => {
                const lastMsg = await models.message.findOne({
                    where: {
                        [Op.or]: [
                            {user_id: user_id, recipient_user_id: companion.user_id},
                            {user_id: companion.user_id, recipient_user_id: user_id}
                        ]
                    },
                    limit: 1,
                    order: [['message_date', 'DESC']],
                    attributes: ['message_text', 'message_date'],
                }) as { message_text: string | null; message_date: Date } | null;

                return {
                    companion_id: companion.user_id,
                    message: lastMsg ? {
                        message_text: lastMsg.message_text,
                        message_date: lastMsg.message_date
                    } : null
                };
            })
        )

        const transformedChats = companionUsers.map(user => {
            const last_message = lastMessages.find(message => user.user_id === message.companion_id)

            return {
                messenger_id: user.user_id,
                messenger_name: user.user_name,
                messenger_image: user.user_img,
                messenger_type: "chat",
                messages: [last_message?.message]
            }
        })

        const messengersList = await models.messenger.findAll({
            include: [
                {
                    model: models.members,
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

        return [...transformedChats, ...messengersList]
    }

    async fetchMessages(type: string, user_id: string, messenger_id: string, post_id?: string) {
        const messages = await models.message.findAll({
            where:
                type !== "chat" ?
                {
                    messenger_id: messenger_id,
                    ...(post_id !== 'undefined' ? {parent_post_id: post_id} : {parent_post_id: null})
                } :
                {recipient_user_id: [messenger_id, user_id]},
            include: [
                {
                    model: models.message,
                    as: 'comments',
                    attributes: [],
                    required: false
                },
                {
                    model: models.message_file,
                    attributes: ['message_file_id', 'message_file_name', 'message_file_size', 'message_file_path']
                },
                {
                    model: models.users,
                    attributes: ['user_id', 'user_name', 'user_img']
                },
                {
                    model: models.message,
                    as: 'reply',
                    attributes: ['message_id', 'message_text'],
                    include: [{model: models.users, attributes: ['user_id', 'user_name', 'user_img']}]
                }
            ],
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.parent_post_id")), "comments_count"]]
            },
            order: [['message_date', 'ASC']],
            group: [
                'message.message_id',
                'message_files.message_file_id',
                'user.user_id',
                'reply.message_id',
                'reply->user.user_id'
            ]
        }) as unknown as IMessagesResponse[]

        if (!messages) return ApiError.internalServerError("An error occurred while fetching the messages")

        const updatedMessages = await Promise.all(
            messages.map(async (message) => {
                const reactions = await models.message_reactions.findAll({
                    attributes: [
                        [Sequelize.fn('COUNT', Sequelize.col('message_reactions.reaction_id')), 'reaction_count']
                    ],
                    include: [{
                        model: models.reactions,
                    }],
                    group: ['reaction.reaction_id'],
                    where: { message_id: message.message_id },
                    raw: true
                }) as unknown as {
                    reaction_count: string,
                    reaction: IReaction
                }[]

                console.log(message.reactions)
                message.reactions = reactions
                console.log(message.reactions)

                return message
            })
        )

        if (!updatedMessages) return ApiError.internalServerError("An error occurred while fetching the messages")

        return updatedMessages
    }

    async postMessage(message: IPostMessage, files: FileArray | null | undefined) {
        const message_id = uuid.v4()
        let message_files: IMessageFiles[] = []

        const messagePost = await models.message.create({
            message_id: message_id,
            message_text: message.message_text,
            message_type: message.message_type,
            reply_id: message.reply_id,
            parent_post_id: message.post_id,
            user_id: message.user_id,
            messenger_id: message.messenger_id,
            recipient_user_id: message.recipient_user_id
        })

        if (files && files.message_files) {
            const fileArray = Array.isArray(files.message_files) ? files.message_files : [files.message_files]

            for (const file of fileArray) {
                const message_file_id = uuid.v4()

                const filesPost = await filesUploadingService(`messengers/${message.messenger_id ? message.messenger_id : message.recipient_user_id}`, file, message.message_type)
                if (!filesPost || filesPost instanceof ApiError) return ApiError.badRequest(`Error with files uploading`)

                const message_file = await models.message_file.create({
                    message_file_id: message_file_id,
                    message_file_name: filesPost.file,
                    message_file_size: filesPost.size,
                    message_id: message_id,
                    message_file_path: message.messenger_id ? message.messenger_id : message.recipient_user_id
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

    async deleteMessage(message_id: string) {
        try {
            const message_files = await models.message_file.findAll({
                where: {message_id: message_id},
                attributes: ['message_file_name', 'message_file_path'],
                raw: true
            }) as unknown as {
                message_file_name: string,
                message_file_path: string,
            }[]

            await models.message.destroy({where: {message_id: message_id}})

            for (const file of message_files) {
                const filePath = path.resolve(__dirname + "/../src/static/messengers", file.message_file_path, file.message_file_name)

                if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getProfile(user_id: string) {
        const userData = await models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_id', 'user_name', 'user_img', 'user_bio']
        }) as IProfileSettings | null

        if (!userData) return ApiError.internalServerError("No user settings found")

        const user_img = userData?.user_img ? fs.readFileSync(__dirname + `/../src/static/users/${user_id}/${userData.user_img}`) : null

        return {
            user_id: userData.user_id,
            user_name: userData.user_name,
            user_bio: userData.user_bio,
            user_img: user_img ? user_img.toString('base64') : null,
        }
    }

    async putProfile(user_id: string, user_name: string, user_bio?: string, user_files?: IUserFiles | null) {
        const oldProfile = await models.users.findOne({where: {user_id: user_id}}) as IUser | null

        if (!oldProfile) return ApiError.notFound(`Profile not found`)
        let user_img = null

        if (user_files?.user_img) {
            const folder = `users/${user_id}`
            user_img = await changeOldImage(oldProfile.user_img, folder, user_files.user_img)

            if (user_img instanceof ApiError) return user_img
        }

        try {
            await models.users.update({
                user_name: user_name,
                user_bio: user_bio,
                user_img: user_img ? user_img.file : oldProfile.user_img
            }, {where: {user_id: user_id}})
        } catch (error) {
            return ApiError.internalServerError(`Error with profile updating`)
        }

        return models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_id', 'user_name', 'user_img', 'user_bio']
        })
    }

    async putPassword(user_id: string, user_password: string, user_password_new: string) {
        const user = await models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_password']
        }) as { user_password: string } | null

        if (!user) return ApiError.notFound("User account not found")
        let comparePassword = bcrypt.compareSync(user_password, user.user_password)

        if (!comparePassword) return ApiError.forbidden('Old password is incorrect')
        const hash_user_password = await bcrypt.hash(user_password_new, 5)

        await models.users.update({
            user_password: hash_user_password,
        }, {where: {user_id: user_id}})

        return "Password successfully updated"
    }
}

export default new UserService()