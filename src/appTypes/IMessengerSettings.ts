import IMember from "./IMember";
import {IReaction} from "./index";
import IRemovedUser from "./sidebar/IRemovedUser";

export default interface IMessengerSettings {
    messenger_setting_type: 'private' | 'public',
    reactions: IReaction[],
    reactions_count: number,
    removed_users: IRemovedUser[],
    members: IMember[],
    moderators: IMember[],
    messenger_name: string,
    messenger_desc: string,
    messenger_image: string | null,
}