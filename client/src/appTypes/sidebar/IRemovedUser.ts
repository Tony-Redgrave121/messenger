import {ContactSchema} from "../../rebuild/5-entities/Contact";

export default interface IRemovedUser {
    removed_user_id: string,
    user: ContactSchema
}