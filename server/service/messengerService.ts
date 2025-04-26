import models from "../model/models"
import ApiError from "../error/ApiError";
import * as uuid from "uuid";
import filesUploadingService from "./filesUploadingService";
import {UploadedFile} from "express-fileupload";

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
            where: {messenger_id: messenger_id},
            include: [{
                model: models.messenger_reactions,
                include: [{
                    model: models.reactions,
                    attributes: ['reaction_code']
                }],
                attributes: []
            }],
            attributes: ['messenger_setting_type']
        })

        const messengerData = await models.messenger.findAll({
            include: [
                {
                    model: models.removed_users,
                    attributes: ['user_id'],
                },
                {
                    model: models.members,
                },
                {
                    model: models.members,
                    as: 'moderators',
                    where: {member_status: "moderator"},
                }
            ],
            where: {messenger_id: messenger_id},
            attributes: [],
        })

        if (!messengerSettings || !messengerData) return ApiError.internalServerError("No messenger settings found")

        const setting = messengerSettings[0].dataValues
        const data = messengerData[0].dataValues

        return {
            messenger_setting_type: setting.messenger_setting_type,
            reactions: setting.messenger_reactions,
            removed_users: data.dataValues.removed_users,
            members: data.dataValues.members,
            moderators: data.dataValues.moderators,
        }
    }
}

export default new MessengerService()