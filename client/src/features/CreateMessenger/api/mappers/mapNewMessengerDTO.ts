import ChatBlockSchema from '@entities/Messenger/model/types/ChatBlockSchema';
import MessengerSchema from '@entities/Messenger/model/types/MessengerSchema';

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
