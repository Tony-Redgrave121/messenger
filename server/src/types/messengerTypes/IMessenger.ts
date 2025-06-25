import MessengerKeys from "../keys/MessengerKeys";

export default interface IMessenger {
    messenger_id: string,
    messenger_name: string,
    messenger_image?: string,
    messenger_desc?: string,
    messenger_type: MessengerKeys,
    messenger_date: Date
}