import ChatInfoSchema from '@widgets/LeftSidebar/model/types/ChatInfoSchema';

const isChatArray = (data: unknown[]): data is ChatInfoSchema[] => {
    return data.every(item => typeof item === 'object' && item !== null && 'user_id' in item);
};

export default isChatArray;
