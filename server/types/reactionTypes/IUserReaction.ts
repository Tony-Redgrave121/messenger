import IReaction from "./IReaction";

export default interface IUserReaction {
    reaction_count: string,
    reaction: IReaction,
    users_ids: string,
}