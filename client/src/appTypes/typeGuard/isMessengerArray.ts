import {IMessengerInfo} from "../index";

const isMessengerArray = (data: any[]): data is IMessengerInfo[] => {
    return data.length > 0 && 'messenger_id' in data[0]
}

export default isMessengerArray