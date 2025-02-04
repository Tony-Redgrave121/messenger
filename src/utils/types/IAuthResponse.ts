export default interface IAuthResponse {
    user_id: string
    user_name: string
    user_description: string
    user_image: string
    user_state: boolean
    user_email: string
    accessToken: string
    refreshToken: string
}