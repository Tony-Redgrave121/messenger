import IMember from "./IMember";

export default interface IAdaptMessenger {
    id: string,
    name: string,
    image?: string,
    desc?: string,
    type: 'chat' | 'channel' | 'group',
    members?: IMember[],
    members_count?: number,
    last_seen?: Date,
}