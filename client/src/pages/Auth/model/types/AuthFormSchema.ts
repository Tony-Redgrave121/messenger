export default interface AuthFormSchema {
    user_email: string,
    user_password: string,
    user_code: number | undefined,
    user_image: File | null,
    user_name: string,
    user_bio: string,
}