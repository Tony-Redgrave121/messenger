export default interface IMessenger {
    messenger_id: string,
    messenger_name: string,
    messenger_date: Date,
    messenger_image?: string,
    messenger_desc?: string,
    messenger_type: string,
}