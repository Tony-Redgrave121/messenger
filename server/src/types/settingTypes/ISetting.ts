import IReaction from "../reactionTypes/IReaction";
import MessengerSettingKeys from "../keys/MessengerSettingKeys";

export default interface ISetting {
    messenger_setting_type: MessengerSettingKeys,
    messenger_setting_id: string,
    messenger_reactions: {
        messenger_reaction_id: string,
        messenger_setting_id: string,
        reaction_id: string,
        reaction: IReaction
    }[]
}