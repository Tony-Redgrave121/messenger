import models from "../model/models"
import ApiError from "../error/ApiError";
import {Op, Sequelize} from "sequelize";
import findAllMessagesQuery from "../shared/sequelizeQueries/findAllMessagesQuery";

class SearchService {
    public getMessengers = async (query: string, type: string) => {
        if (type !== "chat") {
            const chat = await models.messenger.findAll({
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

            if (!chat) throw ApiError.internalServerError("No chats found")
            return chat
        } else {
            const messengers = await models.users.findAll({
                attributes: [
                    'user_id',
                    'user_name',
                    'user_img',
                    'user_last_seen',
                ],
                limit: 10,
                where: {user_name: {[Op.iLike]: `%${query}%`}},
            })

            if (!messengers) throw ApiError.internalServerError("No messengers found")
            return messengers
        }
    }
    public getMessages = async (
        query: string,
        type: string,
        user_id: string,
        messenger_id: string,
        post_id?: string
    ) => {
        const whereBase = type !== "chat" ?
            {
                messenger_id: messenger_id,
                parent_post_id: post_id ?? null,
                message_text: {[Op.iLike]: `%${query}%`}
            } :
            {
                recipient_user_id: [messenger_id, user_id],
                message_text: {[Op.iLike]: `%${query}%`}
            }

        return await models.message.findAll({
            where: whereBase,
            ...findAllMessagesQuery,
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("comments.parent_post_id")), "comments_count"]]
            },
            order: [['message_date', 'ASC']],
        })
    }
}

export default SearchService