export default interface IMessenger {
    messenger_id: string,
    messenger_name: string,
    messenger_image: File | null,
    messenger_desc: string,
    messenger_type: string,
    messenger_members: Array<string>,
}