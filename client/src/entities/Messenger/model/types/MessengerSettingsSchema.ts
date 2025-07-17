import { MemberSchema, ReactionSchema, ContactSchema } from '@shared/types';

export default interface MessengerSettingsSchema {
    messenger_setting_type: 'private' | 'public';
    messenger_setting_id: string;
    messenger_type: string;
    reactions: ReactionSchema[];
    reactions_count: number;
    removed_users: {
        removed_user_id: string;
        user: ContactSchema;
    }[];
    members: MemberSchema[];
    moderators: MemberSchema[];
    messenger_name: string;
    messenger_desc: string;
    messenger_image: string | null;
}
