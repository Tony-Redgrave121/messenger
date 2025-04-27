import models from "../model/models"
import ApiError from "../error/ApiError";
import * as uuid from "uuid";
import filesUploadingService from "./filesUploadingService";
import {UploadedFile} from "express-fileupload";
import * as fs from "fs";
import IReaction from "../types/IReaction";

interface IUserFiles {
    messenger_image?: UploadedFile
}

interface IContacts {
    user: {
        user_id: string,
        user_name: string,
        user_img: string,
        user_last_seen: string
    }
}

class MessengerService {
    async fetchContacts(id: string) {
        const contacts = await models.contacts.findAll({
            where: {owner_id: id},
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen']
            }],
            attributes: []
        }) as unknown as IContacts[]

        if (!contacts) return ApiError.internalServerError("No contacts found")

        return contacts.map(contact => contact.user)
    }

    async postMessenger(user_id: string, messenger_name: string, messenger_desc: string, messenger_type: string, messenger_members?: string[], messenger_files?: IUserFiles | null) {
        const messenger_id = uuid.v4()
        let messenger_image = null

        if (messenger_files && messenger_files.messenger_image) messenger_image = await filesUploadingService(`messengers/${messenger_id}`, messenger_files.messenger_image, 'media')

        if (messenger_image instanceof ApiError) return ApiError.badRequest(`Error with user image creation`)

        const messenger = await models.messenger.create({
            messenger_id,
            messenger_name,
            messenger_image: messenger_image ? messenger_image.file : null,
            messenger_desc,
            messenger_type
        })

        if (messenger instanceof ApiError) return ApiError.badRequest(`Error with messenger creation`)

        const member = await models.members.create({
            member_id: uuid.v4(),
            member_status: "moderator",
            user_id,
            messenger_id
        })

        if (member instanceof ApiError) return ApiError.badRequest(`Error adding users to the messenger`)

        if (messenger_members) {
            if (!Array.isArray(messenger_members)) messenger_members = [messenger_members]

            for (const user_id of messenger_members) {
                await models.members.create({
                    member_id: uuid.v4(),
                    member_status: "user",
                    user_id: user_id,
                    messenger_id
                })
            }
        }

        return {
            messenger_id: messenger_id,
            messenger_name: messenger_name,
            messenger_image: messenger_image ? messenger_image.file : null,
            messenger_type: messenger_type,
            messenger_members: messenger_members,
            messages: []
        }
    }

    async fetchMessengerSettings(messenger_id: string) {
        const messengerSettings = await models.messenger_settings.findAll({
            include: [{
                model: models.messenger_reactions,
                include: [{
                    model: models.reactions,
                    required: false
                }],
                required: false
            }],
            where: {messenger_id: messenger_id},
            attributes: ['messenger_setting_type']
        })

        const reactions_count = await models.reactions.count()

        const messengerData = await models.messenger.findAll({
            include: [
                {
                    model: models.removed_users,
                    attributes: ['user_id'],
                    required: false
                },
                {
                    model: models.members,
                    required: false
                },
                {
                    model: models.members,
                    as: 'moderators',
                    where: {member_status: "moderator"},
                    order: [['member_status', 'ASC']],
                    required: false
                }
            ],
            where: {messenger_id: messenger_id},
            attributes: ['messenger_name', 'messenger_desc', 'messenger_image'],
        })

        if (!messengerSettings || !messengerData) return ApiError.internalServerError("No messenger settings found")

        const setting = messengerSettings[0]?.dataValues
        const data = messengerData[0]?.dataValues
        const messenger_image = data?.messenger_image ? fs.readFileSync(__dirname + `/../src/static/messengers/${messenger_id}/${data.messenger_image}`) : null

        return {
            messenger_setting_type: setting?.messenger_setting_type || 'private',
            messenger_image: messenger_image ? messenger_image.toString('base64') : null,
            messenger_name: data.messenger_name,
            messenger_desc: data.messenger_desc,
            reactions: setting.messenger_reactions?.map(
                (reaction: { dataValues: { reaction: IReaction[] } }) =>
                    reaction.dataValues.reaction
            ) ?? [],
            reactions_count: reactions_count,
            removed_users: data?.removed_users ?? [],
            members: data.members ?? [],
            moderators: data.moderators ?? []
        }
    }

    async fetchReactions() {
        const reactions = await models.reactions.findAll()

        if (!reactions) return ApiError.internalServerError("No reactions found")

        return reactions
    }
}

export default new MessengerService()