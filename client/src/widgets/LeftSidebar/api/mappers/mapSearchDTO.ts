import isChatArray from '@widgets/LeftSidebar/lib/isChatArray';
import isMessengerArray from '@widgets/LeftSidebar/lib/isMessengerArray';
import UnifiedMessengerSchema from '@features/MessengerSearch/model/types/UnifiedMessengerSchema';

const mapSearchDTO = (searchedData: unknown[]): UnifiedMessengerSchema[] => {
    if (isChatArray(searchedData)) {
        return searchedData.map(item => ({
            id: item.user_id,
            name: item.user_name,
            img: item.user_img,
            desc: item.user_last_seen,
        }));
    } else if (isMessengerArray(searchedData)) {
        return searchedData.map(item => ({
            id: item.messenger_id,
            name: item.messenger_name,
            img: item.messenger_image,
            desc: item.count,
        }));
    }

    return [];
};

export default mapSearchDTO;
