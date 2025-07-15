import { AdaptMessengerSchema } from '@entities/Messenger';

const getImagePath = (messenger: AdaptMessengerSchema) => {
    return messenger.image
        ? `${messenger.type !== 'chat' ? 'messengers' : 'users'}/${messenger.id}/${messenger.image}`
        : '';
};

export default getImagePath;
