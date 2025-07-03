export default interface UserStateShema {
    userId: string,
    userName: string,
    userEmail: string,
    userBio: string,
    userImg: string | File | null,
    isAuth: boolean,
    isLoading: boolean,
}