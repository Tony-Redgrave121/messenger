import MessageFileSchema from '@shared/types/MessageFileSchema';
import ReactionSchema from '@shared/types/ReactionSchema';

export default interface MessageSchema {
    message_id: string;
    message_text?: string;
    message_date: Date;
    message_type: string;
    reply_id?: string;
    user_id: string;
    messenger_id: string;
    message_files?: MessageFileSchema[];
    comments_count?: number;
    reactions?: {
        users_ids: string[];
        reaction_count: string;
        reaction: ReactionSchema;
    }[];
    user: {
        user_id: string;
        user_name: string;
        user_img: string;
    };
    reply?: {
        message_id: string;
        message_text: string;
        user: {
            user_id: string;
            user_name: string;
            user_img: string;
        };
    };
}
