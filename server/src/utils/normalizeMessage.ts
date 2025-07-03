import index from "../models";
import {Sequelize} from "sequelize";
import MessageSchema from "../types/messageTypes/MessageSchema";
import convertToPlain from "./convertToPlain";
import IUserReaction from "../types/reactionTypes/IUserReaction";

const normalizeMessage = async (message: MessageSchema) => {
    const reactionsRaw = await index.message_reactions.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('message_reactions.reaction_id')), 'reaction_count'],
            [Sequelize.literal(`STRING_AGG("message_reactions"."user_id"::text, ',')`), 'users_ids']
        ],
        include: [{
            model: index.reactions,
        }],
        group: ['reaction.reaction_id'],
        where: {message_id: message.message_id},
        order: [['reaction_count', 'DESC']],
    })

    const reactionsPlain = convertToPlain<IUserReaction>(reactionsRaw)
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