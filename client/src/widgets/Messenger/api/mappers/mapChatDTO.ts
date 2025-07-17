import { AdaptMessengerSchema } from '@entities/Messenger';
import ChatBlockSchema from '@entities/Messenger/model/types/ChatBlockSchema';
import { MessageSchema } from '@shared/types';

const mapChatDTO = (
    messengerData: AdaptMessengerSchema,
    lastMessage: MessageSchema,
): ChatBlockSchema => {
    return {
        messenger_id: messengerData.id,
        messenger_name: messengerData.name,
        messenger_image: messengerData.image,
        messenger_type: messengerData.type,
        messages: lastMessage
            ? [
                  {
                      message_date: lastMessage.message_date,
                      message_text: lastMessage.message_text,
                  },
              ]
            : [],
    };
};

export default mapChatDTO;
