import { MemberSchema, MessengerTypes } from '@shared/types';

export default interface AdaptMessengerSchema {
    id: string;
    name: string;
    image?: string;
    desc?: string;
    type: MessengerTypes;
    members?: MemberSchema[];
    members_count?: number;
    last_seen?: Date;
}
