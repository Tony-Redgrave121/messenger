import IShortUser from "./IShortUser";

export default interface IUser extends IShortUser {
    user_email: string
    user_bio?: string
    user_password: string
    user_state: boolean
    user_activation_link: string
}