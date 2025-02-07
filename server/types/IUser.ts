import { Model } from "sequelize"

export default interface IUser extends Model {
    user_id: string
    user_name: string
    user_email: string
    user_bio?: string
    user_password: string
    user_img: string
    user_state: boolean
    user_activation_link: string
}