import { ChatBlockSchema, MessengerSchema } from '@entities/Messenger';

const mapNewMessengerDTO = (newMessengerData: MessengerSchema): ChatBlockSchema => {
    return {
        messenger_id: newMessengerData.messenger_id,
        messenger_name: newMessengerData.messenger_name,
        messenger_image: newMessengerData.messenger_image,
        messenger_type: newMessengerData.messenger_type,
        messages: [],
    };
};

export default mapNewMessengerDTO;
