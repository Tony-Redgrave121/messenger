export default interface UpdateMessengerSchema {
    messenger_id: string;
    message_text: string;
    message_date: Date;
    isCurrentMessenger: boolean;
}
