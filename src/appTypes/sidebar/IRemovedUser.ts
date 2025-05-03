import {IContact} from "@appTypes";

export default interface IRemovedUser {
    removed_user_id: string,
    user: IContact[]
}