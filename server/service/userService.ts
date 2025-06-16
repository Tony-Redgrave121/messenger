import ApiError from "../error/ApiError"
import models from "../model/models"
import {UploadedFile} from "express-fileupload"
import path from "path"
import fs from "fs"
import IProfileSettings from "../types/IProfileSettings";
import IUser from "../types/IUser";
import changeOldImage from "../shared/changeOldImage";
import bcrypt from "bcrypt";
import convertToPlain from "../shared/convertToPlain";
import * as uuid from "uuid";

interface IUserFiles {
    user_img?: UploadedFile
}

interface IContacts {
    user: {
        user_id: string,
        user_name: string,
        user_img: string,
        user_last_seen: string
    }
}

class UserService {
    public async getProfile(user_id: string) {
        const user = await models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_id', 'user_name', 'user_img', 'user_bio']
        })
        if (!user) throw ApiError.internalServerError("No user settings found")

        const userPlain = convertToPlain<IProfileSettings>(user)
        let user_img_base64: string | null = null

        if (userPlain.user_img) {
            const imagePath = path.join(__dirname, '/../src/static/users', user_id, userPlain.user_img)

            try {
                const imageBuffer = await fs.promises.readFile(imagePath)
                user_img_base64 = imageBuffer.toString('base64')
            } catch (e) {
                user_img_base64 = null
            }
        }

        return {
            user_id: userPlain.user_id,
            user_name: userPlain.user_name,
            user_bio: userPlain.user_bio,
            user_img: user_img_base64
        }
    }

    public async putProfile(
        user_id: string,
        user_name: string,
        user_bio?: string,
        user_files?: IUserFiles | null
    ) {
        const user = await models.users.findOne({where: {user_id: user_id}})
        if (!user) throw ApiError.notFound(`Profile not found`)

        const userPlain = convertToPlain<IUser>(user)
        let user_img = userPlain.user_img

        if (user_files?.user_img) {
            const folder = `users/${user_id}`
            const newImage = await changeOldImage(userPlain.user_img, folder, user_files.user_img)

            if (newImage instanceof ApiError) throw newImage
            user_img = newImage.file
        }

        await models.users.update({
            user_name: user_name,
            user_bio: user_bio,
            user_img: user_img
        }, {where: {user_id: user_id}})

        return models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_id', 'user_name', 'user_img', 'user_bio']
        })
    }

    public async putPassword(user_id: string, user_password: string, user_password_new: string) {
        const userPassword = await models.users.findOne({
            where: {user_id: user_id},
            attributes: ['user_password']
        })

        if (!userPassword) return ApiError.notFound("User account not found")
        const userPasswordPlain = convertToPlain<{ user_password: string }>(userPassword)

        let comparePassword = await bcrypt.compare(user_password, userPasswordPlain.user_password)
        if (!comparePassword) return ApiError.forbidden('Old password is incorrect')

        const hashedPassword = await bcrypt.hash(user_password_new, 5)
        await models.users.update({
            user_password: hashedPassword,
        }, {where: {user_id: user_id}})

        return {
            status: 200,
            message: "Password successfully updated"
        }
    }

    public async fetchContacts(id: string) {
        const contacts = await models.contacts.findAll({
            where: {owner_id: id},
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen']
            }],
            attributes: []
        }) as unknown as IContacts[]

        if (!contacts) throw ApiError.internalServerError("No contacts found")

        return contacts.map(contact => contact.user)
    }

    public async postContact(userId: string, contactId: string) {
        const newContactId = uuid.v4()

        const contact = await models.contacts.create({
            contact_id: newContactId,
            user_id: contactId,
            owner_id: userId
        })
        if (!contact) throw ApiError.internalServerError("Error with contact creation")

        const newContact = await models.contacts.findOne({
            where: {contact_id: newContactId},
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen']
            }],
            attributes: []
        }) as unknown as IContacts

        return newContact.user
    }

    public async deleteContact(userId: string, contactId: string) {
        await models.contacts.destroy({
            where: {
                owner_id: userId,
                user_id: contactId,
            }
        })
    }
}

export default new UserService()