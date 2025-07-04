import {MemberSchema} from "@entities/Member";

export default interface AdaptMessengerSchema {
    id: string,
    name: string,
    image?: string,
    desc?: string,
    type: 'chat' | 'channel' | 'group',
    members?: MemberSchema[],
    members_count?: number,
    last_seen?: Date,
}