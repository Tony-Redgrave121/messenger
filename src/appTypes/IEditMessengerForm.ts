export default interface IEditMessengerForm {
    messenger_id: string,
    messenger_name: string,
    messenger_image: File | null,
    messenger_desc: string,
    moderators: {
        member_id: string,
        member_status: string
    }[],

}