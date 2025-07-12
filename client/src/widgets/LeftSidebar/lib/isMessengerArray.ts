import MessengerInfoSchema from '@widgets/LeftSidebar/model/types/MessengerInfoSchema';

const isMessengerArray = (data: unknown[]): data is MessengerInfoSchema[] => {
    return data.every(item => typeof item === 'object' && item !== null && 'messenger_id' in item);
};

export default isMessengerArray;
