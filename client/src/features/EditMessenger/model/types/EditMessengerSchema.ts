export default interface EditMessengerSchema {
    messenger_id: string,
    messenger_name: string,
    messenger_image: File | null,
    messenger_desc: string,
}