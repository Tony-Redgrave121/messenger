import {ContactSchema} from "@entities/Contact";

export default interface MemberSchema {
    member_date: Date,
    member_id: string,
    member_status: string,
    messenger_id: string,
    user: ContactSchema
}