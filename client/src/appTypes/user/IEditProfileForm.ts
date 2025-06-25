export default interface IEditProfileForm {
    user_id: string,
    user_name: string,
    user_img: string | File | null,
    user_bio: string,
}