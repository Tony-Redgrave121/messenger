export default interface IAuthResponse {
    user_id: string
    user_name: string
    user_bio: string
    user_img: string | File | null
    user_email: string
    accessToken: string
    refreshToken: string
}