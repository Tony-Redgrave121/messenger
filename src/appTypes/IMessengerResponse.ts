import {IMember} from "./index";

export default interface IMessengerResponse {
    messenger_id: string,
    messenger_name: string,
    messenger_date: Date,
    messenger_image?: string,
    messenger_desc?: string,
    messenger_type: string,
    user_member: IMember[],
    members_count: string
}