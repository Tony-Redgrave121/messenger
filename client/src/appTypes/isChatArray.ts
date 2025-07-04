import {IChatInfo} from "./index";

const isChatArray = (data: any[]): data is IChatInfo[] => {
    return data.length > 0 && 'user_id' in data[0]
}

export default isChatArray