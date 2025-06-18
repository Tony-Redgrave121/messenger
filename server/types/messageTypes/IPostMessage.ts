import FileKeys from "../keys/FileKeys";

export default interface IPostMessage {
    user_id: string,
    messenger_id: string | null,
    reply_id: string,
    post_id?: string,
    message_text: string,
    message_type: FileKeys,
    recipient_user_id: string | null,
}