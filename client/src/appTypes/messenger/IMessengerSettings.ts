import IMember from "../IMember";
import {IReaction} from "../index";
import {ContactSchema} from "@entities/Contact";

export default interface IMessengerSettings {
    messenger_setting_type: 'private' | 'public',
    messenger_setting_id: string,
    messenger_type: string,
    reactions: IReaction[],
    reactions_count: number,
    removed_users: {
        removed_user_id: string,
        user: ContactSchema
    }[],
    members: IMember[],
    moderators: IMember[],
    messenger_name: string,
    messenger_desc: string,
    messenger_image: string | null,
}