import models from "../model/models"
import ApiError from "../error/ApiError";
import * as uuid from "uuid";
import * as fs from "fs";
import IReaction from "../types/IReaction";
import path from "path";
import IMessenger from "../types/IMessenger";
import changeOldImage from "../shared/changeOldImage";
import {UploadedFile} from "express-fileupload";

interface IUserFiles {
    messenger_image?: UploadedFile
}

class MessengerSettingsService {
    public async fetchMessengerSettings(messenger_id: string) {
        const messengerSettings = await models.messenger_settings.findAll({
            include: [{
                model: models.messenger_reactions,
                include: [{
                    model: models.reactions,
                    as: 'reaction',
                    required: false
                }],
                required: false
            }],
            where: {messenger_id: messenger_id},
            attributes: ['messenger_setting_type', 'messenger_setting_id']
        })

        const reactions_count = await models.reactions.count()

        const messengerData = await models.messenger.findAll({
            include: [
                {
                    model: models.removed_users,
                    include: [{
                        model: models.users,
                        attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
                    }],
                    attributes: ['removed_user_id'],
                    required: false
                },
                {
                    model: models.members,
                    include: [{
                        model: models.users,
                        attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
                    }],
                    attributes: ['member_id', 'member_date', 'member_status'],
                    required: false
                },
                {
                    model: models.members,
                    include: [{
                        model: models.users,
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

        const setting = messengerSettings[0]?.dataValues
        const data = messengerData[0]?.dataValues

        if (!setting || !data) throw ApiError.internalServerError("No messenger settings found")

        const messenger_image = data?.messenger_image ? fs.readFileSync(__dirname + `/../src/static/messengers/${messenger_id}/${data.messenger_image}`) : null

        return {
            messenger_setting_type: setting?.messenger_setting_type || 'private',
            messenger_setting_id: setting?.messenger_setting_id || '',
            messenger_type: data?.messenger_type || '',
            messenger_image: messenger_image ? messenger_image.toString('base64') : null,
            messenger_name: data.messenger_name,
            messenger_desc: data.messenger_desc,
            reactions: setting.messenger_reactions?.map(
                (reaction: { dataValues: { reaction: IReaction[] } }) =>
                    reaction.dataValues.reaction
            ) ?? [],
            reactions_count: reactions_count,
            removed_users: data?.removed_users ?? [],
            members: data?.members ?? [],
            moderators: data?.moderators ?? []
        }
    }

    public async updateMessengerType(messenger_id: string, messenger_type: string) {
        const updateRes = await models.messenger_settings.update(
            {messenger_setting_type: messenger_type},
            {where: {messenger_id: messenger_id}}
        )
        if (!updateRes) throw ApiError.internalServerError("No messenger settings found")

        return updateRes
    }

    public async updateMessengerLink(messenger_id: string) {
        const newMessengerId = uuid.v4()

        const messages = await models.message.findAll({
            where: {messenger_id: messenger_id},
            attributes: ['message_id'],
            raw: true,
        }) as unknown as { message_id: string }[]

        const updateRes = await models.messenger.update(
            {messenger_id: newMessengerId},
            {where: {messenger_id: messenger_id}}
        )
        if (!updateRes) throw ApiError.internalServerError("No messenger found")

        const oldPath = path.resolve(__dirname + "/../src/static/messengers", messenger_id)
        const newPath = path.resolve(__dirname + "/../src/static/messengers", newMessengerId)

        const messageIds = messages.map(m => m.message_id)

        if (messageIds.length > 0) {
            await models.message_file.update(
                {message_file_path: newMessengerId},
                {where: {message_id: messageIds}}
            )
        }

        try {
            await fs.promises.rename(oldPath, newPath)
        } catch (err) {
            throw ApiError.internalServerError("Failed to rename messenger folder")
        }

        return {messenger_id: newMessengerId}
    }

    public async postMessengerReactions(messenger_setting_id: string, newReactions: string[]) {
        const reactions = await models.messenger_reactions.findAll({
            where: {messenger_setting_id: messenger_setting_id},
            attributes: ['reaction_id'],
            raw: true,
            nest: true
        }) as unknown as { reaction_id: string }[]

        const oldReactions = reactions.flatMap(react => react.reaction_id)

        const toPost = newReactions.filter(reaction => !oldReactions.includes(reaction))
        const toDelete = oldReactions.filter(reaction => !newReactions.includes(reaction))

        const createPromise = toPost.map(reaction_id => models.messenger_reactions.create({
            messenger_reaction_id: uuid.v4(),
            messenger_setting_id,
            reaction_id,
        }))

        const deletePromise = toDelete.map(reaction_id => models.messenger_reactions.destroy({
            where: {
                reaction_id: reaction_id,
                messenger_setting_id: messenger_setting_id
            }
        }))

        await Promise.all([...createPromise, ...deletePromise])
        return await models.messenger_reactions.findAll({where: {messenger_setting_id: messenger_setting_id}})
    }

    public async updateMessengerModerators(member_status: string, user_id: string, messenger_id: string) {
        await models.members.update(
            {member_status: member_status},
            {where: {messenger_id: messenger_id, user_id: user_id}}
        )

        return await models.members.findOne({
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            where: {messenger_id: messenger_id, user_id: user_id},
            attributes: ['member_id', 'member_date', 'member_status'],
        })
    }

    public async addContactsMembers(members: string[], messenger_id: string) {
        const [existingMembers, removedMembers] = await Promise.all([
            await models.members.findAll({
                attributes: ['user_id'],
                where: {
                    user_id: members,
                    messenger_id
                },
                raw: true
            }) as unknown as { user_id: string }[],
            await models.removed_users.findAll({
                attributes: ['user_id'],
                where: {
                    user_id: members,
                    messenger_id
                },
                raw: true
            }) as unknown as { user_id: string }[]
        ])

        const existing = new Set(existingMembers.map(m => m.user_id))
        const removed = new Set(removedMembers.map(m => m.user_id))

        const filtered = members.filter(user_id => !existing.has(user_id) && !removed.has(user_id))
        if (filtered.length === 0) return []

        await models.members.bulkCreate(filtered.map(user_id => ({
            member_id: uuid.v4(),
            member_status: 'member',
            user_id: user_id,
            messenger_id: messenger_id
        })))

        const getPromise = filtered.map(user_id => models.members.findOne({
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['member_id', 'member_date', 'member_status'],
            where: {user_id: user_id, messenger_id: messenger_id}
        }))

        return await Promise.all(getPromise)
    }

    public async addMember(user_id: string, messenger_id: string) {
        await models.removed_users.destroy({where: {messenger_id: messenger_id, user_id: user_id}})

        await models.members.create({
            member_id: uuid.v4(),
            member_status: 'member',
            user_id: user_id,
            messenger_id: messenger_id
        })

        return await models.members.findOne({
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['member_id', 'member_date', 'member_status'],
            where: {user_id: user_id, messenger_id: messenger_id}
        })
    }

    public async postRemoved(user_id: string, messenger_id: string) {
        await models.removed_users.create({
            removed_user_id: uuid.v4(),
            user_id,
            messenger_id
        })

        await models.members.destroy({
            where: {
                messenger_id: messenger_id,
                user_id: user_id
            }
        })

        return await models.removed_users.findOne({
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen'],
            }],
            attributes: ['removed_user_id'],
            where: {
                messenger_id: messenger_id,
                user_id: user_id
            }
        })
    }

    public async putMessenger(messenger_id: string, messenger_name: string, messenger_desc?: string, messenger_files?: IUserFiles | null) {
        const oldMessenger = await models.messenger.findOne({where: {messenger_id: messenger_id}}) as IMessenger | null

        if (!oldMessenger) throw ApiError.notFound(`Messenger not found`)
        let messenger_image = null

        if (messenger_files?.messenger_image) {
            const folder = `messengers/${messenger_id}`
            messenger_image = await changeOldImage(oldMessenger.messenger_image, folder, messenger_files.messenger_image)

            if (messenger_image instanceof ApiError) return messenger_image
        }

        try {
            await models.messenger.update({
                messenger_name: messenger_name,
                messenger_image: messenger_image ? messenger_image.file : oldMessenger.messenger_image,
                messenger_desc: messenger_desc
            }, {where: {messenger_id: messenger_id}})
        } catch (error) {
            throw ApiError.internalServerError(`Error with messenger updating`)
        }

        return models.messenger.findOne({where: {messenger_id: messenger_id}})
    }

    public async deleteRemoved(user_id: string, messenger_id: string) {
        await models.removed_users.destroy({
            where: {
                messenger_id: messenger_id,
                user_id: user_id
            }
        })
    }

    public async deleteMember(user_id: string, messenger_id: string) {
        await models.members.destroy({
            where: {
                messenger_id: messenger_id,
                user_id: user_id
            }
        })
    }
}

export default MessengerSettingsService