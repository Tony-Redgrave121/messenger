import index from "../models"
import ApiError from "../errors/apiError";
import * as uuid from "uuid";
import uploadFile from "../utils/uploadFile";
import {Op, Sequelize} from "sequelize";
import deleteAllMessages from "../utils/deleteAllMessages";
import MessengerKeys from "../types/keys/MessengerKeys";
import convertToPlain from "../utils/convertToPlain";
import deleteLocalFiles from "../utils/deleteLocalFiles";
import IMessageId from "../types/idTypes/IMessageId";
import IMessengerFiles from "../types/fileTypes/IMessengerFiles";
import ISettingReaction from "../types/settingTypes/ISettingReaction";
import ILastMessage from "../types/messageTypes/ILastMessage";
import IChatId from "../types/idTypes/IChatId";
import IShortUser from "../types/userTypes/IShortUser";
import NotificationSchema from "../types/messengerTypes/NotificationSchema";

class MessengerManagementService {
    public async fetchMessenger(type: MessengerKeys, messenger_id: string) {
        if (type === "chat") {
            const user = await index.users.findOne({
                attributes: ['user_id', 'user_name', 'user_img', 'user_bio', 'user_last_seen'],
                where: {user_id: messenger_id}
            })

            if (!user) throw ApiError.notFound("Messenger not found")
            return user
        } else {
            const messenger = await index.messenger.findOne({
                include: [
                    {
                        model: index.members,
                        attributes: []
                    },
                    {
                        model: index.members,
                        as: "user_member",
                        include: [
                            {
                                model: index.users,
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

        const messengersList = await index.messenger.findAll({
            include: [
                {
                    model: index.members,
                    where: {user_id: user_id},
                    attributes: []
                },
                {
                    model: index.message,
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
        const messages = await index.message.findAll({
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
        await index.message.destroy({where: {message_id: messageIds}})
    }

    public async deleteMessenger(messengerId: string) {
        await deleteLocalFiles(['messengers', messengerId], {recursive: true, force: true})
        await index.messenger.destroy({where: {messenger_id: messengerId}})
    }

    public async getReactions(messenger_id?: string) {
        if (messenger_id) {
            const messengerReactions = await index.messenger_settings.findOne({
                include: [{
                    model: index.messenger_reactions,
                    attributes: ['reaction_id'],
                }],
                attributes: ['messenger_setting_id'],
                where: {messenger_id: messenger_id},
            })
            if (!messengerReactions) return
            const messengerReactionsPlain = convertToPlain<ISettingReaction>(messengerReactions)

            const reactionsIds = messengerReactionsPlain.messenger_reactions.flatMap(r => r.reaction_id)

            return await index.reactions.findAll({where: {reaction_id: reactionsIds}})
        } else {
            const reactions = await index.reactions.findAll()
            if (!reactions) throw ApiError.internalServerError("No reactions found")

            return reactions
        }
    }


    public async fetchNotifications(messengers: NotificationSchema, user_id: string) {
        const newNotifications: NotificationSchema = {}
        const keys = Object.keys(messengers)

        for (const key of keys) {
            if (!messengers[key]?.message_id) {
                const messageId = await index.message.findOne({
                    where: {
                        [Op.or]: [
                            {messenger_id: key},
                            {
                                user_id: key,
                                recipient_user_id: user_id,
                            },
                        ]
                    },
                    attributes: ['message_id'],
                    order: [['message_date', 'DESC']],
                    limit: 1
                })

                if (!messageId) continue
                const messageIdPlain = convertToPlain<IMessageId>(messageId)

                newNotifications[key] = {
                    message_id: messageIdPlain.message_id,
                    count: 0,
                }

                continue
            }

            const message = await index.message.findOne({
                where: {
                    message_id: messengers[key].message_id
                },
                attributes: ['message_date']
            })

            if (!message) continue
            const messagePlain = convertToPlain<{ message_date: Date }>(message)

            const newCount = await index.message.count({
                where: {
                    [Op.or]: [
                        {messenger_id: key},
                        {
                            user_id: key,
                            recipient_user_id: user_id,
                        },
                    ],
                    message_date: {
                        [Op.gt]: messagePlain.message_date,
                    },
                }
            })

            newNotifications[key] = {
                message_id: messengers[key].message_id,
                count: newCount,
            }
        }

        return newNotifications
    }

    public async postMessenger(
        user_id: string,
        messenger_name: string,
        messenger_desc: string,
        messenger_type: string,
        messenger_members?: string[],
        messenger_files?: IMessengerFiles | null
    ) {
        const messenger_id = uuid.v4()
        let messenger_image = null

        if (messenger_files?.messenger_image) {
            const result = await uploadFile(`messengers/${messenger_id}`, messenger_files.messenger_image, 'media')
            if (result instanceof ApiError) throw ApiError.badRequest(`Error with user image creation`)

            messenger_image = result.file
        }

        const messenger = await index.messenger.create({
            messenger_id,
            messenger_name,
            messenger_image,
            messenger_desc,
            messenger_type
        })
        if (!messenger) throw ApiError.internalServerError(`Error with messenger creation`)

        const moderator = await index.members.create({
            member_id: uuid.v4(),
            member_status: "moderator",
            user_id,
            messenger_id
        })
        if (!moderator) throw ApiError.internalServerError(`Error adding creator to the messenger`)

        const messengerSettings = await index.messenger_settings.create({
            messenger_setting_id: uuid.v4(),
            messenger_setting_type: "private",
            messenger_id,
        })
        if (!messengerSettings) throw ApiError.internalServerError(`Error creating messenger settings`)

        if (messenger_members) {
            if (!Array.isArray(messenger_members)) messenger_members = [messenger_members]

            for (const user_id of messenger_members) {
                await index.members.create({
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
        const messages = await index.message.findAll({
            where: {
                [Op.or]: [
                    {user_id},
                    {recipient_user_id: user_id}
                ]
            },
            attributes: ['user_id', 'recipient_user_id'],
        })

        const messagesPlain = convertToPlain<IChatId>(messages)
        const chatIds = new Set<string>()

        messagesPlain.forEach(m => {
            if (m.user_id === user_id && m.recipient_user_id) {
                chatIds.add(m.recipient_user_id)
            } else if (m.recipient_user_id === user_id) {
                chatIds.add(m.user_id)
            }
        })

        const chatUsers = await index.users.findAll({
            where: {user_id: Array.from(chatIds)},
            attributes: ['user_id', 'user_name', 'user_img']
        })

        const chatUsersPlain = convertToPlain<IShortUser>(chatUsers)

        const fullLastMessages = await Promise.all(
            chatUsersPlain.map(async (user) => {
                const lastMessage = await index.message.findOne({
                    where: {
                        [Op.or]: [
                            {
                                user_id,
                                recipient_user_id: user.user_id,
                            },
                            {
                                user_id: user.user_id,
                                recipient_user_id: user_id,
                            }
                        ]
                    },
                    order: [['message_date', 'DESC']],
                    attributes: ['message_text', 'message_date']
                });

                return {
                    message: lastMessage ? convertToPlain<ILastMessage>(lastMessage) : null,
                    companion_id: user.user_id,
                };
            })
        );


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