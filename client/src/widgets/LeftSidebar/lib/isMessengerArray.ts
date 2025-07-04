import MessengerInfoSchema from "@widgets/LeftSidebar/model/types/MessengerInfoSchema";

const isMessengerArray = (data: any[]): data is MessengerInfoSchema[] => {
    return data.length > 0 && 'messenger_id' in data[0]
}

export default isMessengerArray