import index from "../models"
import ApiError from "../errors/apiError";
import * as uuid from "uuid";
import * as fs from "fs";
import path from "path";
import IMessenger from "../types/messengerTypes/IMessenger";
import changeOldImage from "../utils/changeOldImage";
import convertToPlain from "../utils/convertToPlain";
import IMessengerSetting from "../types/settingTypes/IMessengerSetting";
import ISetting from "../types/settingTypes/ISetting";
import IMessageId from "../types/idTypes/IMessageId";
import IReactionId from "../types/idTypes/IReactionId";
import IUserId from "../types/idTypes/IUserId";
import IMessengerFiles from "../types/fileTypes/IMessengerFiles";

class MessengerSettingsService {
    public async fetchMessengerSettings(messenger_id: string) {
        const [messengerSettings, reactions_count, messenger] = await Promise.all([
            index.messenger_settings.findOne({
                include: [{
                    model: index.messenger_reactions,
                    include: [{
                        model: index.reactions,
                        as: 'reaction',
                        required: false
                    }],
                    required: false
                }],
                where: {messenger_id: messenger_id},
                attributes: ['messenger_setting_type', 'messenger_setting_id']
            }),
            index.reactions.count(),
            index.messenger.findOne({
                include: [
                    {
                        model: index.removed_users,
                        include: [{
                            model: index.users,
                            attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
                        }],
                        attributes: ['removed_user_id'],
                        required: false
                    },
                    {
                        model: index.members,
                        include: [{
                            model: index.users,
                            attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
                        }],
                        attributes: ['member_id', 'member_date', 'member_status'],
                        required: false
                    },
                    {
                        model: index.members,
                        include: [{
                            model: index.users,
                            attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
                        }],
                        as: 'moderators',
                        attributes: ['member_id', 'member_date', 'member_status'],
                        where: {member_status: "moderator"},
                        order: [['member_status', 'ASC']],
                        required: false
                    }
                ],
                where: {messenger_id: messenger_id},
                attributes: ['messenger_name', 'messenger_desc', 'messenger_image', 'messenger_type'],
            })
        ])

        if (!messengerSettings || !messenger) throw ApiError.internalServerError("No messenger settings found")

        const settingsPlain = convertToPlain<ISetting>(messengerSettings)
        const messengerPlain = convertToPlain<IMessengerSetting>(messenger)

        let messenger_image: string | null = null
        if (messengerPlain.messenger_image) {
            const imagePath = path.join(__dirname, "../../static/messengers", messenger_id, 'avatar', messengerPlain.messenger_image)

            if (fs.existsSync(imagePath)) {
                messenger_image = fs.readFileSync(imagePath).toString('base64')
            }
        }

        return {
            messenger_setting_type: settingsPlain.messenger_setting_type,
            messenger_setting_id: settingsPlain.messenger_setting_id,
            messenger_type: messengerPlain.messenger_type,
            messenger_image,
            messenger_name: messengerPlain.messenger_name,
            messenger_desc: messengerPlain.messenger_desc,
            reactions: settingsPlain.messenger_reactions?.map(r => r.reaction) ?? [],
            reactions_count,
            removed_users: messengerPlain.removed_users || [],
            members: messengerPlain.members || [],
            moderators: messengerPlain.moderators || []
        }
    }

    public async updateMessengerType(messenger_id: string, messenger_type: string) {
        const [updated] = await index.messenger_settings.update(
            {messenger_setting_type: messenger_type},
            {where: {messenger_id}}
        )

        if (updated === 0) {
            throw ApiError.internalServerError("No messenger settings found or updated")
        }

        return updated
    }

    public async updateMessengerLink(messenger_id: string) {
        const newMessengerId = uuid.v4()
        const messages = await index.message.findAll({
            where: {messenger_id: messenger_id},
            attributes: ['message_id'],
        })

        const messagesPlain = convertToPlain<IMessageId>(messages)
        const [updated] = await index.messenger.update(
            {messenger_id: newMessengerId},
            {where: {messenger_id}}
        )

        if (updated === 0) {
            throw ApiError.internalServerError("No messenger found or updated")
        }

        const oldPath = path.join(__dirname + "../../../static/messengers", messenger_id)
        const newPath = path.join(__dirname + "../../../static/messengers", newMessengerId)

        const messageIds = messagesPlain.map(m => m.message_id)
        await index.message_file.update(
            {message_file_path: newMessengerId},
            {where: {message_id: messageIds}}
        )

        try {
            if (fs.existsSync(oldPath)) await fs.promises.rename(oldPath, newPath)
        } catch (err) {
            throw ApiError.internalServerError("Failed to rename messenger folder")
        }

        return {messenger_id: newMessengerId}
    }

    public async postMessengerReactions(messenger_setting_id: string, newReactions: string[]) {
        const reactions = await index.messenger_reactions.findAll({
            where: {messenger_setting_id: messenger_setting_id},
            attributes: ['reaction_id'],
        })

        const reactionsPlain = convertToPlain<IReactionId>(reactions)
        const oldReactions = reactionsPlain.map(r => r.reaction_id)

        const toPost = newReactions.filter(r => !oldReactions.includes(r))
        const toDelete = oldReactions.filter(r => !newReactions.includes(r))

        const createOps = toPost.map(reaction_id => ({
            messenger_reaction_id: uuid.v4(),
            messenger_setting_id,
            reaction_id
        }))

        await index.messenger_reactions.bulkCreate(createOps)
        await index.messenger_reactions.destroy({
            where: {
                reaction_id: toDelete,
                messenger_setting_id
            }
        })

        return await index.messenger_reactions.findAll({where: {messenger_setting_id}})
    }

    public async updateMessengerModerators(member_status: string, user_id: string, messenger_id: string) {
        await index.members.update(
            {member_status: member_status},
            {where: {messenger_id, user_id}}
        )

        return await index.members.findOne({
            include: [{
                model: index.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            where: {messenger_id, user_id},
            attributes: ['member_id', 'member_date', 'member_status']
        })
    }

    public async addContactsMembers(members: string[], messenger_id: string) {
        const [existingMembers, removedMembers] = await Promise.all([
            await index.members.findAll({
                attributes: ['user_id'],
                where: {
                    user_id: members,
                    messenger_id
                },
            }),
            await index.removed_users.findAll({
                attributes: ['user_id'],
                where: {
                    user_id: members,
                    messenger_id
                },
            })
        ])

        const existingMembersPlain = convertToPlain<IUserId>(existingMembers)
        const removedMembersPlain = convertToPlain<IUserId>(removedMembers)

        const existing = new Set(existingMembersPlain.map(m => m.user_id))
        const removed = new Set(removedMembersPlain.map(m => m.user_id))

        const toPost = members.filter(user_id => !existing.has(user_id) && !removed.has(user_id))
        if (toPost.length === 0) return []

        const newMembersData = toPost.map(user_id => ({
            member_id: uuid.v4(),
            member_status: 'member',
            user_id,
            messenger_id
        }))
        await index.members.bulkCreate(newMembersData)

        return await index.members.findAll({
            include: [{
                model: index.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['member_id', 'member_date', 'member_status'],
            where: {user_id: toPost, messenger_id}
        })
    }

    public async addMember(user_id: string, messenger_id: string) {
        await index.removed_users.destroy({where: {messenger_id, user_id}})

        const existing = await index.members.findOne({where: {messenger_id, user_id}})
        if (existing) return existing

        await index.members.create({
            member_id: uuid.v4(),
            member_status: 'member',
            user_id,
            messenger_id
        })

        return await index.members.findOne({
            include: [{
                model: index.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['member_id', 'member_date', 'member_status'],
            where: {user_id, messenger_id}
        })
    }

    public async postRemoved(user_id: string, messenger_id: string) {
        const existing = await index.removed_users.findOne({where: {user_id, messenger_id}})
        if (!existing) {
            await index.removed_users.create({
                removed_user_id: uuid.v4(),
                user_id,
                messenger_id
            })
        }

        await index.members.destroy({where: {messenger_id, user_id}})

        return await index.removed_users.findOne({
            include: [{
                model: index.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['removed_user_id'],
            where: {messenger_id, user_id}
        })
    }

    public async putMessenger(messenger_id: string, messenger_name: string, messenger_desc?: string, messenger_files?: IMessengerFiles | null) {
        const oldMessenger = await index.messenger.findOne({where: {messenger_id: messenger_id}}) as IMessenger | null

        if (!oldMessenger) throw ApiError.notFound(`Messenger not found`)
        let messenger_image = null

        if (messenger_files?.messenger_image) {
            const folder = `messengers/${messenger_id}/avatar`
            messenger_image = await changeOldImage(oldMessenger.messenger_image, folder, messenger_files.messenger_image)

            if (messenger_image instanceof ApiError) return messenger_image
        }

        await index.messenger.update({
            messenger_name,
            messenger_image: messenger_image ? messenger_image.file : oldMessenger.messenger_image,
            messenger_desc
        }, {where: {messenger_id}})

        return index.messenger.findOne({where: {messenger_id}})
    }

    public async deleteRemoved(user_id: string, messenger_id: string) {
        const deleted = await index.removed_users.destroy({where: {messenger_id, user_id}})

        if (deleted === 0) {
            throw ApiError.notFound('Removed not found')
        }
    }

    public async deleteMember(user_id: string, messenger_id: string) {
        const deleted = await index.members.destroy({where: {messenger_id, user_id}})

        if (deleted === 0) {
            throw ApiError.notFound('Member not found')
        }
    }
}

export default MessengerSettingsService