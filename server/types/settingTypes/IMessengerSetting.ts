import MessengerKeys from "../keys/MessengerKeys";
import IMember from "../userTypes/IMember";

export default interface IMessengerSetting {
    messenger_name: string,
    messenger_desc: string,
    messenger_image: string,
    messenger_type: MessengerKeys,
    removed_users: IMember[],
    members: IMember[],
    moderators: IMember[]
}