import models from "../model/models"
import ApiError from "../error/ApiError";
import {Op, Sequelize} from "sequelize";
import findAllMessagesQuery from "../lib/querys/findAllMessagesQuery";

class SearchService {
    async getMessengers(query: string, type: string) {
        let messengers

        if (type !== "chat") {
            messengers = await models.messenger.findAll({
                include: [
                    {
                        model: models.members,
                        attributes: []
                    },
                    {
                        model: models.messenger_settings,
                        where: {messenger_setting_type: 'public'},
                        attributes: []
                    }
                ],
                attributes: [
                    'messenger_id',
                    'messenger_name',
                    'messenger_image',
                    [Sequelize.fn("COUNT", Sequelize.col("members.member_id")), "count"],
                ],
                where: {
                    messenger_name: {[Op.iLike]: `%${query}%`},
                    messenger_type: type,
                },
                group: ['messenger.messenger_id'],
                limit: 10,
                subQuery: false
            })
        } else {
            messengers = await models.users.findAll({
                attributes: [
                    'user_id',
                    'user_name',
                    'user_img',
                    'user_last_seen',
                ],
                limit: 10,
                where: {user_name: {[Op.iLike]: `%${query}%`}},
            })
        }

        if (!messengers) throw ApiError.internalServerError("No messengers found")

        return messengers
    }
    async getMessages(query: string, type: string, user_id: string, messenger_id: string, post_id?: string) {
        const whereBase = type !== "chat" ?
            {
                messenger_id: messenger_id,
                parent_post_id: post_id ? post_id : null,
                message_text: {[Op.iLike]: `%${query}%`}
            } :
            {
                recipient_user_id: [messenger_id, user_id],
                message_text: {[Op.iLike]: `%${query}%`}
            }

        const messages = await models.message.findAll({
            where: whereBase,
            ...findAllMessagesQuery,
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.parent_post_id")), "comments_count"]]
            },
            order: [['message_date', 'ASC']],
        })

        if (!messages) throw ApiError.internalServerError("No messages found")

        return messages
    }
}

export default new SearchService()