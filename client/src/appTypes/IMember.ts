import {IContact} from "./index";

export default interface IMember {
    member_date: Date,
    member_id: string,
    member_status: string,
    messenger_id: string,
    user: IContact
}