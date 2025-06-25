import IReactionId from "../idTypes/IReactionId";

export default interface ISettingReaction {
    messenger_setting_id: string,
    messenger_reactions: IReactionId[]
}