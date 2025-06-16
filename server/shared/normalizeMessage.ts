import models from "../model/models";
import {Sequelize} from "sequelize";
import IReaction from "../types/IReaction";
import IMessagesResponse from "../types/IMessagesResponse";
import convertToPlain from "./convertToPlain";

interface IUsersReaction {
    reaction_count: string,
    reaction: IReaction,
    users_ids: string,
}

const normalizeMessage = async (message: IMessagesResponse) => {
    const reactionsRaw = await models.message_reactions.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('message_reactions.reaction_id')), 'reaction_count'],
            [Sequelize.literal(`STRING_AGG("message_reactions"."user_id"::text, ',')`), 'users_ids']
        ],
        include: [{
            model: models.reactions,
        }],
        group: ['reaction.reaction_id'],
        where: {message_id: message.message_id},
        order: [['reaction_count', 'DESC']],
    })

    const reactionsPlain = convertToPlain<IUsersReaction>(reactionsRaw)
    const reactions = reactionsPlain?.map(r => ({
        ...r,
        users_ids: r.users_ids?.split(',') ?? []
    }))

    return {
        ...message,
        reactions
    }
}

export default normalizeMessage