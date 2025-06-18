export default interface IMember {
    member_date: Date,
    member_id: string,
    member_status: string,
    messenger_id: string,
    user_id: string,
    user: {
        user_name: string,
        user_img: string
    }
}