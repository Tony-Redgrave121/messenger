export default interface IAuthForm {
    user_email: string,
    user_password: string,
    user_password_confirm: string,
    user_image: File | null,
    user_name: string,
    user_bio: string,
}