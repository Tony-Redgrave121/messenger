export default interface IRegistrationResponse {
    accessToken?: string
    refreshToken?: string
    user_name: string
    user_img: string | null
}