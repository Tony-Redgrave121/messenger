import { AdaptMessengerSchema } from '@entities/Messenger';
import { getDate } from '@shared/lib';

const getHeaderDesc = (messenger: AdaptMessengerSchema) => {
    switch (messenger.type) {
        case 'chat':
            return getDate(messenger.last_seen!, true);
        case 'group':
            return `${messenger.members_count} members`;
        case 'channel':
            return `${messenger.members_count} subscribers`;
        default: {
            const exhaustiveCheck: never = messenger.type;
            return exhaustiveCheck;
        }
    }
};
export default getHeaderDesc;
