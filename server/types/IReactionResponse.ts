import IReaction from "./IReaction";

export default interface IReactionResponse {
    messenger_setting_id: string,
    messenger_reactions: IReaction[]
}