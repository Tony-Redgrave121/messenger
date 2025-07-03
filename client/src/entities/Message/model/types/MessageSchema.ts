import {IReaction, IMessageFile} from "@appTypes";

export default interface MessageSchema {
    message_id: string,
    message_text?: string,
    message_date: Date,
    message_type: string,
    reply_id?: string,
    user_id: string,
    messenger_id: string,
    message_files?: IMessageFile[],
    comments_count?: number,
    reactions?: {
        users_ids: string[],
        reaction_count: string,
        reaction: IReaction
    }[],
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