import models from "../model/models"
import ApiError from "../error/ApiError";
import * as uuid from "uuid";
import uploadFile from "../shared/uploadFile";
import {UploadedFile} from "express-fileupload";
import {Op, Sequelize} from "sequelize";
import deleteAllMessages from "../shared/deleteAllMessages";
import MessengerKeys from "../types/keys/MessengerKeys";
import convertToPlain from "../shared/convertToPlain";
import deleteLocalFiles from "../shared/deleteLocalFiles";

interface IUserFiles {
    messenger_image?: UploadedFile
}

interface IMessageId {
    message_id: string
}

interface IChatMessage {
    user_id: string,
    recipient_user_id: string | null
}

interface IChatUser {
    user_id: string,
    user_name: string,
    user_img?: string
}

interface IMessage {
    message_text: string | null,
    message_date: Date
}

interface IMessengerReaction {
    messenger_setting_id: string,
    messenger_reactions: {
        reaction_id: string
    }[]
}

class MessengerManagementService {
    public async fetchMessenger(type: MessengerKeys, messenger_id: string) {
        if (type === "chat") {
            const user = await models.users.findOne({
                attributes: ['user_id', 'user_name', 'user_img', 'user_bio', 'user_last_seen'],
                where: {user_id: messenger_id}
            })

            if (!user) throw ApiError.notFound("Messenger not found")
            return user
        } else {
            const messenger = await models.messenger.findOne({
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
                where: {
                    messenger_id: messenger_id,
                    messenger_type: type
                },
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

            if (!messenger) throw ApiError.notFound("Messenger not found")
            return messenger
        }
    }

    public async fetchMessengersList(user_id: string) {
        const privateChats = await this.getPrivateChats(user_id)

        const messengersList = await models.messenger.findAll({
            include: [
                {
                    model: models.members,
                    where: {user_id: user_id},
                    attributes: []
                },
                {
                    model: models.message,
                    where: {
                        parent_post_id: null
                    },
                    limit: 1,
                    order: [['message_date', 'DESC']],
                    attributes: ['message_text', 'message_date']
                }
            ],
            attributes: ['messenger_id', 'messenger_name', 'messenger_image', 'messenger_type']
        })

        return [...privateChats, ...messengersList]
    }

    public async deleteChat(userId: string, recipientId: string) {
        const messages = await models.message.findAll({
            where: {
                [Op.or]: [
                    {user_id: userId, recipient_user_id: recipientId},
                    {user_id: recipientId, recipient_user_id: userId}
                ]
            },
            attributes: ['message_id'],
        })

        const messagesPlain = convertToPlain<IMessageId>(messages)

        const messageIds = await deleteAllMessages(messagesPlain)
        await models.message.destroy({where: {message_id: messageIds}})
    }

    public async deleteMessenger(messengerId: string) {
        await deleteLocalFiles(['messengers', messengerId], {recursive: true, force: true})
        await models.messenger.destroy({where: {messenger_id: messengerId}})
    }

    public async getReactions(messenger_id?: string) {
        if (messenger_id) {
            const messengerReactions = await models.messenger_settings.findOne({
                include: [{
                    model: models.messenger_reactions,
                    attributes: ['reaction_id'],
                }],
                attributes: ['messenger_setting_id'],
                where: {messenger_id: messenger_id},
            })
            if (!messengerReactions) return
            const messengerReactionsPlain = convertToPlain<IMessengerReaction>(messengerReactions)

            const reactionsIds = messengerReactionsPlain.messenger_reactions.flatMap(r => r.reaction_id)

            return await models.reactions.findAll({where: {reaction_id: reactionsIds}})
        } else {
            const reactions = await models.reactions.findAll()
            if (!reactions) throw ApiError.internalServerError("No reactions found")

            return reactions
        }
    }

    public async postMessenger(
        user_id: string,
        messenger_name: string,
        messenger_desc: string,
        messenger_type: string,
        messenger_members?: string[],
        messenger_files?: IUserFiles | null
    ) {
        const messenger_id = uuid.v4()
        let messenger_image = null

        if (messenger_files?.messenger_image) {
            const result = await uploadFile(`messengers/${messenger_id}`, messenger_files.messenger_image, 'media')
            if (result instanceof ApiError) throw ApiError.badRequest(`Error with user image creation`)

            messenger_image = result.file
        }

        const messenger = await models.messenger.create({
            messenger_id,
            messenger_name,
            messenger_image,
            messenger_desc,
            messenger_type
        })
        if (!messenger) throw ApiError.internalServerError(`Error with messenger creation`)

        const moderator = await models.members.create({
            member_id: uuid.v4(),
            member_status: "moderator",
            user_id,
            messenger_id
        })
        if (!moderator) throw ApiError.internalServerError(`Error adding creator to the messenger`)

        const messengerSettings = await models.messenger_settings.create({
            messenger_setting_id: uuid.v4(),
            messenger_setting_type: "private",
            messenger_id,
        })
        if (!messengerSettings) throw ApiError.internalServerError(`Error creating messenger settings`)

        if (messenger_members) {
            if (!Array.isArray(messenger_members)) messenger_members = [messenger_members]

            for (const user_id of messenger_members) {
                await models.members.create({
                    member_id: uuid.v4(),
                    member_status: "member",
                    user_id: user_id,
                    messenger_id
                })
            }
        }

        return {
            messenger_id,
            messenger_name,
            messenger_image,
            messenger_type,
            messenger_members: messenger_members,
            messages: []
        }
    }

    private getPrivateChats = async (user_id: string) => {
        const messages = await models.message.findAll({
            where: {
                [Op.or]: [
                    {user_id},
                    {recipient_user_id: user_id}
                ]
            },
            attributes: ['user_id', 'recipient_user_id'],
        })

        const messagesPlain = convertToPlain<IChatMessage>(messages)
        const chatIds = new Set<string>()

        messagesPlain.forEach(m => {
            if (m.user_id === user_id && m.recipient_user_id) {
                chatIds.add(m.recipient_user_id)
            } else if (m.recipient_user_id === user_id) {
                chatIds.add(m.user_id)
            }
        })

        const chatUsers = await models.users.findAll({
            where: {user_id: Array.from(chatIds)},
            attributes: ['user_id', 'user_name', 'user_img']
        })

        const chatUsersPlain = convertToPlain<IChatUser>(chatUsers)
        const lastMessages = await models.message.findAll({
            where: {
                [Op.or]: [
                    {
                        user_id: user_id,
                        recipient_user_id: chatUsersPlain.map(c => c.user_id)
                    },
                    {
                        user_id: chatUsersPlain.map(c => c.user_id),
                        recipient_user_id: user_id
                    }
                ]
            },
            limit: 1,
            order: [['message_date', 'DESC']],
            attributes: ['message_text', 'message_date']
        })

        const lastMessagesPlain = convertToPlain<IMessage>(lastMessages)
        const fullLastMessages = lastMessagesPlain.map((l, i) => ({
            message: l,
            companion_id: chatUsersPlain[i].user_id
        }))

        return chatUsersPlain.map(user => {
            const lastMessage = fullLastMessages.find(message => user.user_id === message.companion_id)

            return {
                messenger_id: user.user_id,
                messenger_name: user.user_name,
                messenger_image: user.user_img,
                messenger_type: "chat",
                messages: [lastMessage?.message]
            }
        })
    }
}

export default MessengerManagementService