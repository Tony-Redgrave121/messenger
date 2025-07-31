import index from "../models"
import ApiError from "../errors/apiError";
import {Op, Sequelize} from "sequelize";
import findAllMessagesQuery from "../utils/sequelizeQueries/findAllMessagesQuery";

class SearchService {
    public getMessengers = async (query: string, type: string) => {
        if (type !== "chat") {
            const chat = await index.messenger.findAll({
                include: [
                    {
                        model: index.members,
                        attributes: []
                    },
                    {
                        model: index.messenger_settings,
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
            const messengers = await index.users.findAll({
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
                [Op.or]: [
                    {
                        user_id: user_id,
                        recipient_user_id: messenger_id,
                        message_text: {[Op.iLike]: `%${query}%`}
                    },
                    {
                        user_id: messenger_id,
                        recipient_user_id: user_id,
                        message_text: {[Op.iLike]: `%${query}%`}
                    }
                ]
            }

        return await index.message.findAll({
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