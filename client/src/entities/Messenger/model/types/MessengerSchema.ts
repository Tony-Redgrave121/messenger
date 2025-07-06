import { MemberSchema } from '@entities/Member';

export default interface MessengerSchema {
    messenger_id: string;
    messenger_name: string;
    messenger_date: Date;
    messenger_image?: string;
    messenger_desc?: string;
    messenger_type: 'chat' | 'channel' | 'group';
    user_member: MemberSchema[];
    members_count: number;
}
