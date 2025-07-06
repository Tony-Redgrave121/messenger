import ChatInfoSchema from '@widgets/LeftSidebar/model/types/ChatInfoSchema';

const isChatArray = (data: any[]): data is ChatInfoSchema[] => {
    return data.length > 0 && 'user_id' in data[0];
};

export default isChatArray;
