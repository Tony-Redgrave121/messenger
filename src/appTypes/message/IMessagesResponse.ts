import IMessageFile from "./IMessageFile";

export default interface IMessagesResponse {
    message_id: string,
    message_text?: string,
    message_date: Date,
    message_type: string,
    reply_id?: string,
    user_id: string,
    messenger_id: string,
    message_files?: IMessageFile[]
    comments_count?: number
    user: {
        user_id: string,
        user_name: string,
        user_img: string,
    },
    reply?: {
        message_id: string,
        message_text: string,

        user: {
            user_id: string,
            user_name: string,
            user_img: string,
        }
    }
}