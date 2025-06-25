import IMember from "../IMember";
import {IReaction} from "@appTypes";
import IRemovedUser from "../sidebar/IRemovedUser";

export default interface IMessengerSettings {
    messenger_setting_type: 'private' | 'public',
    messenger_setting_id: string,
    messenger_type: string,
    reactions: IReaction[],
    reactions_count: number,
    removed_users: IRemovedUser[],
    members: IMember[],
    moderators: IMember[],
    messenger_name: string,
    messenger_desc: string,
    messenger_image: string | null,
}