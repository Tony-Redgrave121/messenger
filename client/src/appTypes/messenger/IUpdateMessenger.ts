export default interface IUpdateMessenger {
    messenger_id: string,
    message_text: string,
    message_date: Date,
    isCurrentMessenger: boolean
}