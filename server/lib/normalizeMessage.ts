import models from "../model/models";
import {Sequelize} from "sequelize";
import IReaction from "../types/IReaction";
import IMessagesResponse from "../types/IMessagesResponse";

const normalizeMessage = async (message: IMessagesResponse) => {
    const reactions = await models.message_reactions.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('message_reactions.reaction_id')), 'reaction_count'],
            [Sequelize.literal(`STRING_AGG("message_reactions"."user_id"::text, ',')`), 'users_ids']
        ],
        include: [{
            model: models.reactions,
        }],
        group: ['reaction.reaction_id'],
        where: {message_id: message.message_id},
        raw: true,
        nest: true,
        order: [['reaction_count', 'DESC']],
    }) as unknown as {
        reaction_count: string,
        reaction: IReaction,
        users_ids: string,
    }[]

    message.reactions = reactions?.map((reaction) => ({
        ...reaction,
        users_ids: reaction.users_ids?.split(',') ?? []
    }))

    return message
}

export default normalizeMessage