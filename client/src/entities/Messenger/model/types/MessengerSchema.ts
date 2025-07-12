import { MemberSchema } from '@entities/Member';
import { MessengerTypes } from '@shared/types';

export default interface MessengerSchema {
    messenger_id: string;
    messenger_name: string;
    messenger_date: Date;
    messenger_image?: string;
    messenger_desc?: string;
    messenger_type: MessengerTypes;
    user_member: MemberSchema[];
    members_count: number;
}
