import { ContactSchema } from '@entities/Contact';
import { AdaptMessengerSchema, MessengerSchema } from '@entities/Messenger';

const mapMessengerDTO = (messengerData: MessengerSchema | ContactSchema): AdaptMessengerSchema => {
    if ('user_id' in messengerData) {
        return {
            id: messengerData.user_id,
            name: messengerData.user_name,
            image: messengerData.user_img,
            desc: messengerData.user_bio,
            type: 'chat',
            last_seen: messengerData.user_last_seen,
        };
    } else {
        return {
            id: messengerData.messenger_id,
            name: messengerData.messenger_name,
            image: messengerData.messenger_image,
            desc: messengerData.messenger_desc,
            type: messengerData.messenger_type,
            members: messengerData.user_member,
            members_count: messengerData.members_count,
        };
    }
};

export default mapMessengerDTO;
