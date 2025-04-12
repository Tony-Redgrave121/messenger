export default interface IMessengersListResponse {
    messenger_id: string,
    messenger_name: string,
    messenger_image?: string,
    messenger_type: string,
    messages: {
        message_date: Date,
        message_text: string
    }[]
}